use core::fmt::{Display, Formatter, Error};

#[derive(Copy, Drop)]
enum Message { // TODO: define the different variants used below
}


fn main() { // don't change any of the lines inside main
    let mut messages: Array<Message> = ArrayTrait::new();

    //don't change any of the next 4 lines
    messages.append(Message::Quit);
    messages.append(Message::Echo('hello world'));
    messages.append(Message::Move((10, 30)));
    messages.append(Message::ChangeColor((0, 255, 255)));

    print_messages_recursive(messages, 0)
}

// Utility function to print messages. Don't modify these.

trait MessageTrait<T> {
    fn call(self: T);
}

impl MessageImpl of MessageTrait<Message> {
    fn call(self: Message) {
        println!("{}", self);
    }
}

fn print_messages_recursive(messages: Array<Message>, index: u32) {
    if index >= messages.len() {
        return ();
    }
    let message = *messages.at(index);
    message.call();
    print_messages_recursive(messages, index + 1)
}


impl MessageDisplay of Display<Message> {
    fn fmt(self: @Message, ref f: Formatter) -> Result<(), Error> {
        println!("___MESSAGE BEGINS___");
        let str: ByteArray = match self {
            Message::Quit => format!("Quit"),
            Message::Echo(msg) => format!("{}", msg),
            Message::Move((a, b)) => {
                format!("{} {}", a, b)
            },
            Message::ChangeColor((red, green, blue)) => {
                format!("{} {} {}", red, green, blue)
            }
        };
        f.buffer.append(@str);
        println!("___MESSAGE ENDS___");
        Result::Ok(())
    }
}
