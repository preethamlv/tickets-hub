import { Subjects, Publisher, ExpirationCompleteEvent } from "@plvtickets/common";


export class ExpirationCompletePublishers extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    
}
