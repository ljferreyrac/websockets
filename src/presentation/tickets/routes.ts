import { Router } from "express";
import { TicketController } from "./controller";

export class TicketRoutes{
    static get routes(){
        const router = Router();
        const controller = new TicketController();
        router.get('/', controller.getTickets);

        router.get('/last', controller.getLastTicketNumber);

        router.get('/pending', controller.getPendingTickets);
        
        router.post('/', controller.createTicket);
        
        router.get('/draw/:desk', controller.drawTicket);

        router.put('/done/:ticketId', controller.ticketFinished);
        
        router.get('/working-on', controller.workingOn);
        return router;
    }
}