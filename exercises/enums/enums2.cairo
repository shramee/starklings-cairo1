// enums2.cairo
// Execute `starklings hint enums2` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

use debug::print;
use debug::print_felt;
use array::ArrayTrait;
use traits::Into;

#[derive(Copy)]
enum Message {// TODO: define the different variants used below
}


fn main() {
    let mut messages: Array::<Message> = ArrayTrait::new();
    messages.append(Message::Quit(()));
    messages.append(Message::Echo('hello world'));
    messages.append(Message::Move((10_u32, 30_u32)));
    messages.append(Message::ChangeColor((0_u8, 255_u8, 255_u8)));

    print_messages_recursive(messages, 0_u32)
}

// Utility function to print messages. Don't modify these.

trait MessageTrait<T> {
    fn call(self: T);
}

impl MessageImpl of MessageTrait::<Message> {
    fn call(self: Message) {
        self.print()
    }
}

fn print_messages_recursive(messages: Array::<Message>, index: u32) {
    if index >= messages.len() {
        return ();
    }
    let message = *messages.at(index);
    message.call();
    print_messages_recursive(messages, index + 1_u32)
}


trait PrintTrait<T> {
    fn print(self: T);
}

impl MessagePrintImpl of PrintTrait::<Message> {
    fn print(self: Message) {
        print_felt('___MESSAGE BEGINS___');
        match self {
            Message::Quit(()) => print_felt('Quit'),
            Message::Echo(msg) => print_felt(msg),
            Message::Move((a, b)) => {
                print_felt(a.into());
                print_felt(b.into())
            },
            Message::ChangeColor((
                red, green, blue
            )) => {
                print_felt(red.into());
                print_felt(green.into());
                print_felt(blue.into())
            }
        }
        print_felt('___MESSAGE ENDS___');
    }
}

impl MessageArrayDrop of Drop::<Array::<Message>>;
