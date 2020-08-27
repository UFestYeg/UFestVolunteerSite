export const compareArrays = (a: any[], b: any[], sort: boolean = true) => {
    if (sort) {
        a.sort();
        b.sort();
    }
    return JSON.stringify(a) === JSON.stringify(b);
};
