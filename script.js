
"use strict";


// =====================================
// CONFIGURAÇÕES
// =====================================

const precos = {
    300: 12,
    500: 18
};

const limites = {
    300: 2,
    500: 4
};

const taxaCentro = 5;
const taxaOutrosBairros = 10;


// =====================================
// ELEMENTOS DA TELA
// =====================================

const botoesTamanho =
    document.querySelectorAll(".tamanho");

const adicionais =
    document.querySelectorAll(".extra");

const avisoLimite =
    document.getElementById("avisoLimite");

const avisoAdicionais =
    document.getElementById("avisoAdicionais");

const campoNome =
    document.getElementById("nome");

const campoTelefone =
    document.getElementById("telefone");

const campoBairro =
    document.getElementById("bairro");

const formPedido =
    document.getElementById("formPedido");

const resultado =
    document.getElementById("resultado");


// =====================================
// ESTADO DO PEDIDO
// =====================================

let tamanhoSelecionado = 300;


// =====================================
// FORMATAÇÃO DE MOEDA
// =====================================

function moeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// =====================================
// CONTAR ADICIONAIS
// =====================================

function contarAdicionais() {

    let quantidade = 0;

    adicionais.forEach(function (adicional) {

        if (adicional.checked) {

            quantidade++;

        }

    });

    return quantidade;

}


// =====================================
// MOSTRAR AVISOS
// =====================================

function mostrarAviso(mensagem, tipo) {

    resultado.hidden = false;

    resultado.textContent = mensagem;

    resultado.className = "aviso " + tipo;

}


// =====================================
// SELECIONAR TAMANHO
// =====================================

botoesTamanho.forEach(function (botao) {

    botao.addEventListener("click", function () {

        tamanhoSelecionado =
            Number(botao.dataset.ml);


        // Atualiza aparência

        botoesTamanho.forEach(function (item) {

            item.classList.remove("selecionado");

        });

        botao.classList.add("selecionado");


        // Verifica limite

        const limite =
            limites[tamanhoSelecionado];

        let quantidade =
            contarAdicionais();


        // Remove extras acima do limite

        if (quantidade > limite) {

            adicionais.forEach(function (adicional) {

                if (quantidade > limite &&
                    adicional.checked) {

                    adicional.checked = false;

                    quantidade--;

                }

            });

            mostrarAviso(
                "Você escolheu um copo menor. " +
                "Os adicionais foram ajustados " +
                "para respeitar o limite.",
                "erro"
            );

        }

        atualizarTela();

    });

});


// =====================================
// SELECIONAR ADICIONAIS
// =====================================

adicionais.forEach(function (adicional) {

    adicional.addEventListener("change", function () {

        const limite =
            limites[tamanhoSelecionado];

        const quantidade =
            contarAdicionais();


        // Bloqueia seleção acima do limite

        if (quantidade > limite) {

            adicional.checked = false;

            mostrarAviso(
                "Limite atingido! " +
                "O copo de " +
                tamanhoSelecionado +
                " ml permite apenas " +
                limite +
                " adicionais.",
                "erro"
            );

        }

        atualizarTela();

    });

});


// =====================================
// TAXA DE ENTREGA
// =====================================

function calcularEntrega() {

    const bairro =
        campoBairro.value.trim();

    if (bairro.toLowerCase() === "centro") {

        return taxaCentro;

    }

    return taxaOutrosBairros;

}


// =====================================
// CALCULAR ADICIONAIS
// =====================================

function calcularAdicionais() {

    let total = 0;

    adicionais.forEach(function (adicional) {

        if (adicional.checked) {

            total +=
                Number(adicional.dataset.preco);

        }

    });

    return total;

}


// =====================================
// ATUALIZAR RESUMO
// =====================================

function atualizarTela() {

    const precoAcai =
        precos[tamanhoSelecionado];

    const precoExtras =
        calcularAdicionais();

    const entrega =
        calcularEntrega();

    const total =
        precoAcai +
        precoExtras +
        entrega;

    const quantidade =
        contarAdicionais();

    const limite =
        limites[tamanhoSelecionado];


    // Tamanho

    document.getElementById(
        "resumoTamanho"
    ).textContent =
        tamanhoSelecionado + " ml";


    // Preço do açaí

    document.getElementById(
        "valorAcai"
    ).textContent =
        moeda(precoAcai);


    // Preço dos adicionais

    document.getElementById(
        "valorAdicionais"
    ).textContent =
        moeda(precoExtras);


    // Taxa de entrega

    document.getElementById(
        "valorEntrega"
    ).textContent =
        moeda(entrega);


    // Total

    document.getElementById(
        "valorTotal"
    ).textContent =
        moeda(total);


    // Aviso de limite

    avisoLimite.textContent =
        "Copo de " +
        tamanhoSelecionado +
        " ml: máximo de " +
        limite +
        " adicionais.";


    // Quantidade selecionada

    avisoAdicionais.textContent =
        "Adicionais selecionados: " +
        quantidade +
        " de " +
        limite;


    // Bloqueia extras não marcados
    // quando o limite é atingido.

    adicionais.forEach(function (adicional) {

        adicional.disabled =
            quantidade >= limite &&
            !adicional.checked;

    });

}


// =====================================
// MÁSCARA DO TELEFONE
// =====================================

campoTelefone.addEventListener(
    "input",
    function () {

        let numero =
            campoTelefone.value.replace(/\D/g, "");

        numero = numero.slice(0, 11);


        if (numero.length > 10) {

            numero =
                numero.replace(
                    /^(\d{2})(\d{5})(\d{4})$/,
                    "($1) $2-$3"
                );

        } else if (numero.length > 6) {

            numero =
                numero.replace(
                    /^(\d{2})(\d{4})(\d{0,4})$/,
                    "($1) $2-$3"
                );

        } else if (numero.length > 2) {

            numero =
                numero.replace(
                    /^(\d{2})(\d{0,5})$/,
                    "($1) $2"
                );

        }

        campoTelefone.value = numero;

    }
);


// =====================================
// CONFIRMAR PEDIDO
// =====================================

formPedido.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        resultado.hidden = true;


        // NOME

        const nome =
            campoNome.value.trim();

        if (nome.length < 2) {

            mostrarAviso(
                "Digite seu nome completo.",
                "erro"
            );

            campoNome.focus();

            return;

        }


        // TELEFONE

        const telefone =
            campoTelefone.value.replace(/\D/g, "");

        if (telefone.length !== 11) {

            mostrarAviso(
                "Digite um telefone válido " +
                "com DDD e 11 números.",
                "erro"
            );

            campoTelefone.focus();

            return;

        }


        // BAIRRO

        const bairro =
            campoBairro.value.trim();

        if (bairro.length < 2) {

            mostrarAviso(
                "Informe seu bairro.",
                "erro"
            );

            campoBairro.focus();

            return;

        }


        // LIMITE DE ADICIONAIS

        const quantidade =
            contarAdicionais();

        const limite =
            limites[tamanhoSelecionado];

        if (quantidade > limite) {

            mostrarAviso(
                "O limite de adicionais " +
                "foi ultrapassado.",
                "erro"
            );

            return;

        }


        // VALORES

        const precoAcai =
            precos[tamanhoSelecionado];

        const precoExtras =
            calcularAdicionais();

        const entrega =
            calcularEntrega();

        const total =
            precoAcai +
            precoExtras +
            entrega;


        // LISTA DE ADICIONAIS

        const listaExtras = [];

        adicionais.forEach(function (adicional) {

            if (adicional.checked) {

                listaExtras.push(
                    adicional.value
                );

            }

        });


        // PEDIDO

        const pedido = {

            nome: nome,

            telefone: campoTelefone.value,

            bairro: bairro,

            tamanho:
                tamanhoSelecionado + " ml",

            adicionais:
                listaExtras.length > 0
                    ? listaExtras.join(", ")
                    : "Nenhum",

            valorAcai:
                moeda(precoAcai),

            valorAdicionais:
                moeda(precoExtras),

            taxaEntrega:
                moeda(entrega),

            total:
                moeda(total)

        };


        // CONFIRMAÇÃO

        mostrarAviso(
            "PEDIDO CONFIRMADO!\n\n" +

            "Cliente: " +
            pedido.nome +

            "\nTelefone: " +
            pedido.telefone +

            "\nBairro: " +
            pedido.bairro +

            "\nTamanho: " +
            pedido.tamanho +

            "\nAdicionais: " +
            pedido.adicionais +

            "\nAçaí: " +
            pedido.valorAcai +

            "\nAdicionais: " +
            pedido.valorAdicionais +

            "\nEntrega: " +
            pedido.taxaEntrega +

            "\nTOTAL: " +
            pedido.total,

            "sucesso"
        );

    }
);


atualizarTela();
