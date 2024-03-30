const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('h1');
const spanQueue = document.querySelector('.alert');
const lblCurrentTicket = document.querySelector('small');
const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');

const searchParams = new URLSearchParams(window.location.search);
if(!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('Escritorio es requerido');
}

const desk = searchParams.get('escritorio');
let workingTicket = null;
deskHeader.innerHTML = desk;

const checkTicketCount = ( currentCount = 0 ) => {
    if(currentCount === 0){
        spanQueue.classList.remove('d-none');
        lblPending.classList.add('d-none');
    } else{
        lblPending.classList.remove('d-none');
        spanQueue.classList.add('d-none');
    }
    lblPending.innerHTML = currentCount;
}

const loadInitialCount = async() => {
    const pending = await fetch('/api/ticket/pending').then(resp => resp.json());
    checkTicketCount(pending.length);
}

const getTicket = async() => {
    await finishTicket();
    const { status, ticketToDraw, message } = await fetch(`/api/ticket/draw/${desk}`)
        .then(resp => resp.json());
    if( status === 'error' ){
        lblCurrentTicket.innerHTML = message;
        return;
    }

    workingTicket = ticketToDraw;
    lblCurrentTicket.innerHTML = ticketToDraw.number;
}

const finishTicket = async() => {
    if(!workingTicket) return;
    const { status, message } = await fetch(`/api/ticket/done/${workingTicket.id}`, {
        method: 'PUT'
    })
        .then(resp => resp.json())
    
    if( status === 'error' ){
        lblCurrentTicket.innerHTML = message;
        return;
    }
    workingTicket = null;
    lblCurrentTicket.innerHTML = '....';
}

function connectToWebSockets() {

    const socket = new WebSocket( 'ws://localhost:3000/ws' );
  
    socket.onmessage = ( event ) => {
      const {type, payload} = JSON.parse(event.data);
      if(type !== 'on-ticket-count-changed') return;
      checkTicketCount(payload);
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

btnDraw.addEventListener('click', getTicket);
btnDone.addEventListener('click', finishTicket);
loadInitialCount();
connectToWebSockets();
  
  

