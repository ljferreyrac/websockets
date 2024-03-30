const currentTicketLbl = document.querySelector('#lbl-new-ticket');
const createTicketBtn = document.querySelector('button');

const getLastTicket = async() => {
    const lastTicket = await fetch('http://localhost:3000/api/ticket/last').then(resp => resp.json());
    currentTicketLbl.innerHTML = lastTicket;
}

const createTicket = async() => {
    const newTicket = await fetch('http://localhost:3000/api/ticket', {
        method: 'POST'
    }).then(resp => resp.json());

    currentTicketLbl.innerHTML = newTicket.number;
}

getLastTicket();

createTicketBtn.addEventListener('click', createTicket);