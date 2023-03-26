// options3.cairo
// Execute `starklings hint options3` or use the `hint` watch subcommand for a hint.


use option::OptionTrait;
use debug::PrintTrait;
use array::ArrayTrait;

#[derive(Drop)]
struct Student {
    name: felt252,
    courses: Array<Option<felt252>>,
}


fn display_grades(student: @Student, index: usize) {
    // don't mind these lines! They are required when
    // running recursive functions.
    match gas::withdraw_gas() {
        Option::Some(_) => {},
        Option::None(_) => {
            let mut data = ArrayTrait::new();
            data.append('Out of gas');
            panic(data);
        },
    }

    if index == 0_usize {
        let mut msg = ArrayTrait::new();
        msg.append(*student.name);
        msg.append('\'s grades:');
        debug::print(msg);
    }
    if index >= student.courses.len() {
        return ();
    }

    let course = *student.courses.at(index);

    // TODO: Modify the following lines so that if there is a grade for the course, it is printed.
    //       Otherwise, print "No grade".
    //  
    if (course.is_some()){
        course.unwrap().print();
        } else {
        ('No grade').print();
        }

    
    display_grades(student, index + 1_usize);
}


#[test]
#[available_gas(20000000)]
fn test_all_defined() {
    let mut courses = ArrayTrait::<Option<felt252>>::new();
    courses.append(Option::Some('A'));
    courses.append(Option::Some('B'));
    courses.append(Option::Some('C'));
    courses.append(Option::Some('A'));
    let mut student = Student { name: 'Alice', courses: courses };
    display_grades(@student, 0_usize);
}


#[test]
#[available_gas(20000000)]
fn test_some_empty() {
    let mut courses = ArrayTrait::<Option<felt252>>::new();
    courses.append(Option::Some('A'));
    courses.append(Option::None(()));
    courses.append(Option::Some('B'));
    courses.append(Option::Some('C'));
    courses.append(Option::None(()));
    let mut student = Student { name: 'Bob', courses: courses };
    display_grades(@student, 0_usize);
}
