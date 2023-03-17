// enums1.cairo
// No hints this time! ;)

// I AM NOT DONE

use debug::print;
use debug::print_felt252;
enum Message { // TODO: define a few types of messages as used below
}

fn main() {
    Message::Quit(()).print();
    Message::Echo(()).print();
    Message::Move(()).print();
    Message::ChangeColor(()).print();
}

trait PrintTrait<T> {
    fn print(self: T);
}

impl MessagePrintImpl of PrintTrait::<Message> {
    fn print(self: Message) {
        match self {
            Message::Quit(()) => print_felt252('Quit'),
            Message::Echo(()) => print_felt252('Echo'),
            Message::Move(()) => print_felt252('Move'),
            Message::ChangeColor(()) => print_felt252('ChangeColor')
        }
    }
}
