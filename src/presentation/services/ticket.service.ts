import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interfaces/ticket.interface";
import { WssService } from "./wss.service";

export class TicketService{

    constructor(
        private readonly wssService = WssService.instance,
    ){}

    public tickets: Ticket[] = [
        {id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false},
        {id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false},
        {id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false},
        {id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false},
        {id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false},
        {id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false},
    ];

    private readonly workingOnTickets: Ticket[] = [];

    public get pendingTickets(): Ticket[] {
        return this.tickets.filter( ticket => !ticket.handleAtDesk );
    }

    public get lastWorkingOnTickets(): Ticket[] {
        return this.workingOnTickets.slice(0, 4);
    }

    public get lastTicketNumber(): number {
        return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
    }

    public createTicket(): Ticket {
        const ticket: Ticket = {
            id: UuidAdapter.v4(),
            number: this.lastTicketNumber+ 1,
            createdAt: new Date(),
            done: false
        }

        this.tickets.push(ticket);
        this.onTicketNumberChanged();
        return ticket;
    }

    public drawTicket(desk: string) {
        const ticketToDraw = this.tickets.find( ticket => !ticket.handleAtDesk );
        if( !ticketToDraw ) return { status: 'error', message: 'No hay tickets pendientes' };

        ticketToDraw.handleAtDesk = desk;
        ticketToDraw.handledAt = new Date();

        this.workingOnTickets.unshift({...ticketToDraw});
        this.onTicketNumberChanged();
        this.onWorkingOnChanged();
        return { status: 'ok', ticketToDraw };
    }

    public onFinishedTicket( id: string ){
        const ticketFinished = this.tickets.find(ticket => ticket.id === id);
        if( !ticketFinished ) return { status: 'error', message: 'Ticket no encontradp' };

        this.tickets = this.tickets.map( ticket => {
            if( ticket.id === id ){
                ticket.done = true;
            }

            return ticket;
        });

        return {status: 'ok'};
    }

    private onTicketNumberChanged(){
        this.wssService.sendMessage('on-ticket-count-changed', this.pendingTickets.length);
    }

    private onWorkingOnChanged(){
        this.wssService.sendMessage('on-working-changed', this.lastWorkingOnTickets)
    }
}