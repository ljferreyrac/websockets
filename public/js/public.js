const spanFirstTicket = document.querySelector('#lbl-ticket-01');
const spanSecondTicket = document.querySelector('#lbl-ticket-02');
const spanThirdTicket = document.querySelector('#lbl-ticket-03');
const spanFourthTicket = document.querySelector('#lbl-ticket-04');
const spanFirstDesk = document.querySelector('#lbl-desk-01');
const spanSecondDesk = document.querySelector('#lbl-desk-02');
const spanThirdDesk = document.querySelector('#lbl-desk-03');
const spanFourthDesk = document.querySelector('#lbl-desk-04');

const renderTickets = ( tickets = [] ) => {
    for (let i = 0; i < tickets.length; i++) {
        if( i>= 4 ) break;
        const ticket = tickets[i];
        if( !ticket ) continue;
        const spanTicket = document.querySelector(`#lbl-ticket-0${i+1}`);
        const spanDesk = document.querySelector(`#lbl-desk-0${i+1}`);

        spanTicket.innerHTML = `Ticket ${ticket.number}`;
        spanDesk.innerHTML = ticket.handleAtDesk;
    }
}

const loadWorkingTickets = async() => {
    const workingTickets = await fetch('/api/ticket/working-on')
        .then(resp => resp.json());
    renderTickets(workingTickets)
}



function connectToWebSockets() {

    const socket = new WebSocket( 'ws://localhost:3000/ws' );
  
    socket.onmessage = ( event ) => {
        const {type, payload} = JSON.parse(event.data);
        if(type !== 'on-working-changed') return;
        renderTickets(payload);
    };
  
    socket.onclose = ( event ) => {
      console.log( 'Connection closed' );
      setTimeout( () => {
        console.log( 'retrying to connect' );
        connectToWebSockets();
      }, 1500 );
  
    };
  
    socket.onopen = ( event ) => {
      console.log( 'Connected' );
    };
  
}
  
loadWorkingTickets();
connectToWebSockets();