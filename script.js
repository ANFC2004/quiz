const SUPABASE_URL = "https://ipjmtviosstyeqvpnquh.supabase.co";
const SUPABASE_KEY = "sb_publishable_Myqr5LaiWFeeqY5T54YMbw_hH5gDmRd";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const questions = [
    "¿Qué cosas estoy haciendo que te están haciendo sentir poco querida?",

    "¿Qué cosas necesitas que haga más?",

    "¿Qué cosas prometí o dije que haría y que para ti son importantes?",

    "¿Qué cosas hago que sí te hacen sentir amada?",

    "¿Qué esperas de mí ahora que llevamos tanto tiempo juntos y estamos a distancia?",

    "¿Hay algo que hayas dejado de pedirme porque sientes que de todas formas no lo voy a hacer?"
];


let currentQuestion = 0;

let answers = JSON.parse(
    localStorage.getItem("respuestasPareja")
) || new Array(questions.length).fill("");


const intro = document.getElementById("intro");

const questionScreen =
    document.getElementById("questionScreen");

const finishScreen =
    document.getElementById("finishScreen");

const answersScreen =
    document.getElementById("answersScreen");


const startBtn =
    document.getElementById("startBtn");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const showAnswersBtn =
    document.getElementById("showAnswersBtn");


const questionText =
    document.getElementById("questionText");

const questionNumber =
    document.getElementById("questionNumber");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const answer =
    document.getElementById("answer");

const answersContainer =
    document.getElementById("answersContainer");


function showScreen(screen) {

    document.querySelectorAll(".screen")
        .forEach(element => {
            element.classList.remove("active");
        });

    screen.classList.add("active");
}


function loadQuestion() {

    questionText.textContent =
        questions[currentQuestion];

    answer.value =
        answers[currentQuestion];

    questionNumber.textContent =
        `Pregunta ${currentQuestion + 1} de ${questions.length}`;


    const percentage =
        Math.round(
            ((currentQuestion + 1) / questions.length) * 100
        );

    progressPercent.textContent =
        `${percentage}%`;

    progressFill.style.width =
        `${percentage}%`;


    previousBtn.disabled =
        currentQuestion === 0;


    if (currentQuestion === questions.length - 1) {

        nextBtn.textContent =
            "Finalizar";

    } else {

        nextBtn.textContent =
            "Siguiente";

    }
}


function saveCurrentAnswer() {

    answers[currentQuestion] =
        answer.value;

    localStorage.setItem(
        "respuestasPareja",
        JSON.stringify(answers)
    );
}

async function guardarRespuestas() {

    const datos = {
        respuesta_1: answers[0],
        respuesta_2: answers[1],
        respuesta_3: answers[2],
        respuesta_4: answers[3],
        respuesta_5: answers[4],
        respuesta_6: answers[5]
    };

    const { data, error } = await supabaseClient
        .from("respuestas_pareja")
        .insert([datos]);

    if (error) {
        console.error("Error al guardar las respuestas:", error);

        alert(
            "No se pudieron guardar las respuestas. " +
            "Revisa la conexión con Supabase."
        );

        return false;
    }

    console.log("Respuestas guardadas correctamente");

    return true;
}


startBtn.addEventListener("click", () => {

    currentQuestion = 0;

    showScreen(questionScreen);

    loadQuestion();

});


nextBtn.addEventListener("click", async () => {

    saveCurrentAnswer();


    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;

        loadQuestion();

    } else {

    const guardado = await guardarRespuestas();

    if (guardado) {
        showScreen(finishScreen);
    }

}

});


previousBtn.addEventListener("click", () => {

    saveCurrentAnswer();


    if (currentQuestion > 0) {

        currentQuestion--;

        loadQuestion();

    }

});


showAnswersBtn.addEventListener("click", () => {

    saveCurrentAnswer();

    answersContainer.innerHTML = "";


    questions.forEach((question, index) => {

        const card =
            document.createElement("div");

        card.className =
            "answer-card";


        const title =
            document.createElement("h3");

        title.textContent =
            `${index + 1}. ${question}`;


        const response =
            document.createElement("p");

        response.textContent =
            answers[index] ||
            "No se escribió una respuesta.";


        card.appendChild(title);

        card.appendChild(response);

        answersContainer.appendChild(card);

    });


    showScreen(answersScreen);

});