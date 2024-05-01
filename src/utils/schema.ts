import { FormKitSchemaDOMNode, FormKitSchemaFormKit, FormKitSchemaNode } from '@formkit/core';

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

export function useData(schema: KnowledgeTree) {
    return {
        schema: splitKnowledge(schema)
    }
}
