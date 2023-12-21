macro_rules! warn {
    ($fmt:literal, $ex:expr) => {{
        use console::{style, Emoji};
        use std::env;
        let formatstr = format!($fmt, $ex);
        println!();
        if env::var("NO_EMOJI").is_ok() {
            println!("{} {}", style("!").red(), style(formatstr).red());
        } else {
            println!(
                "{} {}",
                style(Emoji("⚠️ ", "!")).red(),
                style(formatstr).red()
            );
        }
        println!();
    }};
}

macro_rules! success {
    ($fmt:literal, $ex:expr) => {{
        use console::{style, Emoji};
        use std::env;
        let formatstr = format!($fmt, $ex);
        println!();
        if env::var("NO_EMOJI").is_ok() {
            println!("{} {}", style("✓").green(), style(formatstr).green());
        } else {
            println!(
                "{} {}",
                style(Emoji("✅", "✓")).green(),
                style(formatstr).green()
            );
        }
        println!();
    }};
}

macro_rules! progress {
    ($fmt:literal, $ex:expr) => {{
        use console::{style, Emoji};
        use std::env;
        let formatstr = format!($fmt, $ex);
        println!();
        if env::var("NO_EMOJI").is_ok() {
            println!("{} {}", style("○").yellow(), style(formatstr).yellow());
        } else {
            println!(
                "{} {}",
                style(Emoji("🟡", "○")).yellow(),
                style(formatstr).yellow()
            );
        }
        println!();
    }};
}
