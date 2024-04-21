import { FormKitNode, FormKitSchemaDOMNode, FormKitSchemaFormKit, FormKitSchemaNode } from '@formkit/core';
import { reactive, ref } from 'vue';

type Knowledge = Partial<FormKitSchemaDOMNode> & FormKitSchemaFormKit & {
    id: string
    when?: unknown
}

export type KnowledgeTree = Knowledge & {
    nested?: Knowledge[]
}
function change(k: Knowledge, parent?: Knowledge): (FormKitSchemaDOMNode & FormKitSchemaFormKit) & { name: string } {
    const clone = { ...k }
    clone.name = k.id
    if (parent && k.when) {
        clone.if = `$get(${parent.id}).value == "${k.when}"`
    }
    clone.when = undefined
    if (clone.$el === undefined) {
        clone.$el = null
    }
    return clone as any
}
export function splitKnowledge<T extends KnowledgeTree>(knowledge: T) {
    function _split(k: KnowledgeTree, acc: FormKitSchemaNode[]): FormKitSchemaNode[] {
        if (!k.nested) {
            return acc
        }
        for (const n of k.nested) {
            acc.push(change(n, k))
            _split(n, acc)
        }
        k.nested = undefined
        return acc
    }

    const acc = _split(change(knowledge) as any, [])
    knowledge.children = acc
    return knowledge
}


export function useEvaluate<V>() {
    const data = ref(new Map<string, V>())
    type ValueOnly<T> = (value: T) => V
    type ValueNode<T> = (value: T, node: FormKitNode) => V
    function bindEval<T>(check: ValueOnly<T> | ValueNode<T>) {
        return (value: T, node: FormKitNode) => {
            data.value.set(node.name, check(value, node) as any)
        }
    }

    // function withOption<O extends { label: string, value: string }>(check: ValueOnly<O> | ValueNode<O>) {
    //     return (value: string, node: FormKitNode) => {
    //         const option: O = node.props.options.find((opt: O) => opt.value == value)
    //         data.value.set(node.name, check(option, node) as any)
    //     }
    // }
    return {
        data,
        bindEval,
        // withOption,
    }
}

export interface KnowledgeWithVBind<V> extends KnowledgeTree {
    vBind?: Record<string, V>
}
export function useData<V>(schema: KnowledgeWithVBind<V>) {
    const data = reactive<Record<string, V>>({})
    const clone = { ...schema } // TODO: don't clone
    function _setData(n: KnowledgeWithVBind<V>) {
        if (n.nested instanceof Array) {
            for (const c of n.nested) {
                if (typeof c === 'string') {
                    continue
                }
                _setData(c)
            }
        }
        data[n.id] = n.vBind
        n.bind = `$${n.id}`
        n.vBind = undefined
    }
    _setData(clone)

    return {
        data,
        schema: splitKnowledge(clone)
    }
}
