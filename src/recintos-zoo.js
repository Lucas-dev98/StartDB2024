class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];

        this.animaisInfo = {
            LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animaisInfo[animal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const recintosViaveis = this.recintos
            .filter(recinto => this.podeAdicionarAnimal(recinto, animal, quantidade))
            .map(recinto => {
                const espacoOcupado = this._calcularEspacoOcupado(recinto, animal, quantidade);
                const espacoLivre = recinto.tamanho - espacoOcupado;
                return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
            });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }

    podeAdicionarAnimal(recinto, especie, quantidade) {
        const animalInfo = this.animaisInfo[especie];

        // Verifica se o recinto tem espaço suficiente
        if (!this.temEspacoSuficiente(recinto, especie, quantidade)) return false;

        // Verifica se o bioma é adequado para o animal
        if (!this.biomaAdequado(recinto, especie)) return false;

        // Verifica as condições específicas para os macacos
        if (especie === 'MACACO' && !this.condicoesParaMacacos(recinto, especie)) return false;

        // Verifica as condições específicas para os hipopótamos
        if (especie === 'HIPOPOTAMO' && !this.condicoesParaHipopotamos(recinto)) return false;

        // Verifica as condições para carnívoros e não carnívoros
        if (!this.condicoesParaCarnivoros(recinto, especie)) return false;

        return true;
    }

    // Função 1: Verifica se há espaço suficiente
    temEspacoSuficiente(recinto, especie, quantidade) {
        const espacoOcupado = this._calcularEspacoOcupado(recinto, especie, quantidade);
        return espacoOcupado <= recinto.tamanho;
    }

    // Função 2: Verifica se o bioma é adequado
    biomaAdequado(recinto, especie) {
        const animalInfo = this.animaisInfo[especie];
        return animalInfo.bioma.some(b => recinto.bioma.includes(b));
    }

    // Função 3: Verifica as condições específicas para macacos
    condicoesParaMacacos(recinto, especie) {
        // Se o recinto está vazio, permite adicionar macacos
        if (recinto.animais.length === 0) return true;

        // Se há outra espécie no recinto, permite
        const outrasEspecies = recinto.animais.some(animal => animal.especie !== especie);
        return outrasEspecies; // Permite se houver outra espécie
    }

    // Função 4: Verifica as condições específicas para hipopótamos
    condicoesParaHipopotamos(recinto) {
        return recinto.bioma.includes('savana') || recinto.bioma.includes('rio');
    }

    // Função 5: Verifica as condições para animais carnívoros
    condicoesParaCarnivoros(recinto, especie) {
        const animalInfo = this.animaisInfo[especie];

        // Se o animal que estamos tentando adicionar é carnívoro, ele só pode ser colocado com outros da mesma espécie
        if (animalInfo.carnivoro) {
            return recinto.animais.every(animal => animal.especie === especie);
        }

        // Se o animal não é carnívoro, ele não pode ser colocado com carnívoros
        return recinto.animais.every(animal => !this.animaisInfo[animal.especie].carnivoro);
    }

    _calcularEspacoOcupado(recinto, novaEspecie, novaQuantidade) {
        let espacoOcupado = recinto.animais.reduce((total, animal) => {
            return total + this.animaisInfo[animal.especie].tamanho * animal.quantidade;
        }, 0);

        espacoOcupado += this.animaisInfo[novaEspecie].tamanho * novaQuantidade;

        // Considera espaço extra se houver múltiplas espécies
        if (recinto.animais.length > 0 && recinto.animais.some(animal => animal.especie !== novaEspecie)) {
            espacoOcupado += 1; // Espaço extra para múltiplas espécies
        }

        return espacoOcupado;
    }
}

export { RecintosZoo as RecintosZoo };
