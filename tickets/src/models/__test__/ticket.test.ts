import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
    // create an instance of a ticket
    const ticket = Ticket.build({
        title: 'movie1',
        price: 5,
        userId: 'fakeUser'
    });

    // save the ticket to the db
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // save the first fetched ticket
    await firstInstance!.save();
    
    // save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reached this point');
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'movie2',
        price: 20,
        userId: 'fakeUser'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});
