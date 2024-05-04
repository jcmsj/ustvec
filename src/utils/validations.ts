import { FormKitNode } from "@formkit/core";
import dayjs from "dayjs";
export function afterInputDate(node:FormKitNode, targetId:string,addDays:number=1,addMonths:number=0) {
    const target = node.at("$parent")?.find(targetId)
    if (target === undefined) {
        throw new Error(`Could not find target: ${targetId}`)

    }

    if (target.props.type != 'date') {
        throw new Error(`Input must be of type date`)
    }
    const expected = dayjs(target.value as string)
    const modified = expected.add(addDays, 'day').add(addMonths, 'month')
    const actual = dayjs(node.value as string)
    return actual.isAfter(modified)
}
