class HackerNews {
    static #data = new Map();

    static getData(pageNumber) {
        return this.#data.get(pageNumber);
    }

    static setData(pageNumber, newData) {
        this.#data.set(pageNumber, newData);
    }

    static getAllData() {
        return this.#data;
    }
}

module.exports = HackerNews;
