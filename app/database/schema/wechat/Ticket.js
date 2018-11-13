const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;
const TicketSchema = new Schema({
    name: String,
    ticket: String,
    expires_in: Number,
    meta: {
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        updatedAt: {
            type: Date,
            default: Date.now(),
        },        
    },
});
TicketSchema.pre('save', function(next){
    if(this.isNew){
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
}); 
TicketSchema.statics = {
    async getTicket(){
        const Ticket = await this.findOne({
            name: 'ticket'
        });
        return Ticket;
    },
    async saveTicket(data){
        let ticket = await this.findOne({
            name: 'ticket'
        });
        if(ticket){
            ticket.ticket = data.ticket;
            ticket.expires_in = data.expires_in;
        }else{
            ticket = new Ticket({
                name: 'ticket',
                ticket: data.ticket,
                expires_in: data.expires_in,
            });
        }
        await ticket.save();
        return data;
    },
};
const Ticket = Mongoose.model('Ticket', TicketSchema, 'tickets');