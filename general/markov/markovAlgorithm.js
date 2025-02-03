class AdvancedMarkovChains {
    constructor(order = 2) {
        this.order = order;
        this.wordList = new Map();
    }

    generateDictionary(texts) {
        this.wordList.clear();
        texts.forEach(text => this.pickWords(text));
    }

    generateChain(maxLength = 15) {
        const keys = Array.from(this.wordList.keys());
        if (keys.length === 0) return '';

        let currentKey = keys[Math.floor(Math.random() * keys.length)];
        let generatedWords = currentKey.split(' ');

        while (generatedWords.length < maxLength) {
            let nextWords = this.wordList.get(currentKey);
            if (!nextWords || nextWords.length === 0) break;

            let nextWord = nextWords[Math.floor(Math.random() * nextWords.length)];
            generatedWords.push(nextWord);
            currentKey = generatedWords.slice(-this.order).join(' ');
        }

        return this.formatSentence(generatedWords.join(' '));
    }

    pickWords(text) {
        const words = text.split(/\s+/).map(word => this.parseKey(word)).filter(Boolean);
        for (let i = 0; i <= words.length - this.order; i++) {
            const key = words.slice(i, i + this.order).join(' ');
            const nextWord = words[i + this.order];

            if (!this.wordList.has(key)) {
                this.wordList.set(key, []);
            }
            if (nextWord) {
                this.wordList.get(key).push(nextWord);
            }
        }
    }

    parseKey(word) {
        return word.replace(/[^a-zA-Z0-9\s:|&<>@]/g, '').toLowerCase();
    }

    formatSentence(sentence) {
        sentence = sentence.trim();
        return sentence;
    }
}

module.exports = AdvancedMarkovChains;
