// I AM NOT DONE

use debug::PrintTrait;


#[derive(Copy, Drop)]
enum Message { // TODO: define the different variants used below
}


fn main() {
    let mut messages: Array<Message> = ArrayTrait::new();
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
        self.print()
    }
}

fn print_messages_recursive(messages: Array<Message>, index: u32) {
    match gas::withdraw_gas() {
        Option::Some(_) => {},
        Option::None => {
            let mut data = ArrayTrait::<felt252>::new();
            data.append('OOG');
            panic(data);
        },
    }
    if index >= messages.len() {
        return ();
    }
    let message = *messages.at(index);
    message.call();
    print_messages_recursive(messages, index + 1)
}


impl MessagePrintImpl of PrintTrait<Message> {
    fn print(self: Message) {
        println!("___MESSAGE BEGINS___");
        match self {
            Message::Quit => println!("Quit"),
            Message::Echo(msg) => println!("{}", msg),
            Message::Move((a, b)) => {
                println!("{}", a);
                println!("{}",b);
            },
            Message::ChangeColor((red, green, blue)) => {
                println!("{}",red);
                println!("{}",green);
                println!("{}",blue);
            }
        }
        println!("___MESSAGE ENDS___");
    }
}
