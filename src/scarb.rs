use std::{env, fs, path::PathBuf};

use anyhow::Context;
use cairo_lang_test_plugin::TestCompilation;
use cairo_lang_test_runner::{CompiledTestRunner, TestRunConfig};
use camino::Utf8PathBuf;

use scarb::{
    core::{Config, TargetKind},
    ops::{self, collect_metadata, CompileOpts, MetadataOptions},
};

pub fn prepare_crate_for_exercise(file_path: &PathBuf, crate_path: PathBuf) {
    let lib_path = crate_path.join("src/lib.cairo");
    match fs::copy(file_path, lib_path) {
        Ok(_) => {}
        Err(err) => panic!("Error occurred while preparing the exercise:\n {err:?}"),
    };
}

pub fn scarb_build(file_path: &PathBuf) -> anyhow::Result<String> {
    let path = env::current_dir().unwrap();
    let (config, crate_path) = scarb_config(path.join(PathBuf::from("runner-crate")));

    prepare_crate_for_exercise(file_path, crate_path);

    match compile(&config, false) {
        Ok(_) => Ok("".into()),
        Err(_) => anyhow::bail!("Couldn't build the exercise..."),
    }
}

pub fn scarb_test(file_path: &PathBuf) -> anyhow::Result<String> {
    let path = env::current_dir().unwrap();
    let (config, crate_path) = scarb_config(path.join(PathBuf::from("runner-crate")));

    prepare_crate_for_exercise(file_path, crate_path);

    let ws = ops::read_workspace(config.manifest_path(), &config)?;

    compile(&config, true)?;

    let metadata = collect_metadata(
        &MetadataOptions {
            version: 1,
            no_deps: false,
        },
        &ws,
    )
    .unwrap();

    let profile = env::var("SCARB_PROFILE").unwrap_or("dev".into());
    let default_target_dir = metadata.runtime_manifest.join("target");

    let target_dir = metadata
        .target_dir
        .clone()
        .unwrap_or(default_target_dir)
        .join(profile);

    for package in metadata.packages.iter() {
        if package.name != "runner_crate" {
            continue;
        }
        for target in package.targets.iter() {
            if target.kind == "test" {
                continue;
            }
            // let file_path = target_dir.join(format!("{}.test.json", target.name.clone()));
            let file_path = target_dir.join(format!("{}_unittest.test.json", target.name.clone()));
            let test_compilation = serde_json::from_str::<TestCompilation>(
                &fs::read_to_string(file_path.clone())
                    .with_context(|| format!("failed to read file: {file_path}"))?,
            )
            .with_context(|| format!("failed to deserialize compiled tests file: {file_path}"))?;

            let config = TestRunConfig {
                filter: "".into(),
                include_ignored: false,
                ignored: false,
            };
            let runner = CompiledTestRunner::new(test_compilation, config);
            runner.run()?;
            println!();
        }
    }

    anyhow::Ok("".into())
}

pub fn scarb_config(crate_path: PathBuf) -> (Config, PathBuf) {
    let path = Utf8PathBuf::from_path_buf(crate_path.join(PathBuf::from("Scarb.toml"))).unwrap();

    let config = Config::builder(path).build().unwrap();

    (config, crate_path)
}

pub fn compile(config: &Config, test_targets: bool) -> anyhow::Result<()> {
    let ws = ops::read_workspace(config.manifest_path(), &config)?;
    let opts: CompileOpts = match test_targets {
        false => CompileOpts {
            include_targets: vec![],
            exclude_targets: vec![TargetKind::TEST],
        },
        true => CompileOpts {
            include_targets: vec![TargetKind::TEST],
            exclude_targets: vec![],
        },
    };

    let packages = ws.members().map(|p| p.id).collect();

    ops::compile(packages, opts, &ws)
}
