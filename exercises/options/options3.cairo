

// I AM NOT DONE

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
        Option::None => {
            let mut data = ArrayTrait::new();
            data.append('Out of gas');
            panic(data);
        },
    }

    if index == 0 {
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
    println!("grade is {}", course.unwrap());
    display_grades(student, index + 1);
}


#[test]
#[available_gas(20000000)]
fn test_all_defined() {
    let courses = array![
        Option::Some('A'),
        Option::Some('B'),
        Option::Some('C'),
        Option::Some('A'),
    ];
    let mut student = Student { name: 'Alice', courses: courses };
    display_grades(@student, 0);
}


#[test]
#[available_gas(20000000)]
fn test_some_empty() {
    let courses = array![
        Option::Some('A'),
        Option::None,
        Option::Some('B'),
        Option::Some('C'),
        Option::None,
    ];
    let mut student = Student { name: 'Bob', courses: courses };
    display_grades(@student, 0);
}
