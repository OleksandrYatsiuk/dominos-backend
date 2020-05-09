export function setSorting(sort: any) {
    let condition = {};
    if (sort) {
        if (sort.toString().includes('-')) {
            condition[`${sort.toString().substring(1)}`] = -1
        } else {
            condition[`${sort.toString()}`] = 1
        }
    } else {
        condition['createdAt'] = 1
    }
    return condition;
}