// I AM NOT DONE

use debug::PrintTrait;
enum Message { // TODO: define a few types of messages as used below
}

fn main() {
    Message::Quit.print();
    Message::Echo.print();
    Message::Move.print();
    Message::ChangeColor.print();
}

impl MessagePrintImpl of PrintTrait<Message> {
    fn print(self: Message) {
        match self {
            Message::Quit => println!("Quit"),
            Message::Echo => println!("Echo"),
            Message::Move => println!("Move"),
            Message::ChangeColor => println!("ChangeColor")
        }
    }
}
