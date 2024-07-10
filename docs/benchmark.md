# Benchmarks

## Eslint

`hyperfine --runs 3 --warmup 1 'npx eslint src'`

|     date     |    delay     | node  |      machine      | comment                                         |
| :----------: | :----------: | :---: | :---------------: | ----------------------------------------------- |
| 2023-09-02#1 | 51s ±  1.6 s | 18.17 | romain nzxl win11 |                                                 |
| 2023-09-02#2 | 23s ±  1.9 s | 18.17 | romain nzxl win11 | 2 times faster with etc/no-deprecated off       |
| 2023-09-02#3 | 21s ±  0.1 s | 18.17 | romain nzxl win11 | bit faster with tailwind rules off for *.ts     |
| 2023-09-02#4 | 20s ±  1.9 s | 18.17 | romain nzxl win11 | bit faster with putout/putout off               |
| 2023-09-02#5 | 18s ±  0.1 s | 18.17 | romain nzxl win11 | bit faster with import/namespace & no-cycle off |
| 2023-09-02#6 | 17s ±  0.3 s | 18.17 | romain nzxl win11 | bit faster with etc/no-internal off             |
| 2024-04-12#1 | 15s ±  0.4 s | 20.12 | romain nzxl win11 |                                                 |
| 2024-07-10#1 | 08s ±  0.2 s | 20.14 | romain duc win11  | with eslint-plugin-shuunen 0.2 ^^               |

Note 1 : to show time taken by rules : `TIMING=1 npx eslint src`

Note 2 : to view final config : `npx eslint --print-config src/app.vue > eslint-vue.config.json && npx eslint --print-config src/main.ts > eslint-ts.config.json`

Note 3 : to list eslint scanned files : `DEBUG=eslint:cli-engine npx eslint src`
