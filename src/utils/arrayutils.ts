class ArrayUtils {

    public static pushIfNotExists(array: Array<string>, item: any): void {
        console.log(array+ " :: " + item);
        if (array.indexOf(item) === -1 ) {
            array.push(item);
        }
    }
}

export default ArrayUtils;
