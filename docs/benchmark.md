# Benchmarks

## Eslint

`hyperfine --runs 3 --warmup 1 'npx eslint --ext .ts,.vue .'`

|     date     |    delay     |  node   |      machine      | comment                                         |
| :----------: | :----------: | :-----: | :---------------: | ----------------------------------------------- |
| 2023-09-02#1 | 51s ±  1.6 s | 18.17.1 | romain nzxl win11 |                                                 |
| 2023-09-02#2 | 23s ±  1.9 s | 18.17.1 | romain nzxl win11 | 2 times faster with etc/no-deprecated off       |
| 2023-09-02#3 | 21s ±  0.1 s | 18.17.1 | romain nzxl win11 | bit faster with tailwind rules off for *.ts     |
| 2023-09-02#4 | 20s ±  1.9 s | 18.17.1 | romain nzxl win11 | bit faster with putout/putout off               |
| 2023-09-02#5 | 18s ±  0.1 s | 18.17.1 | romain nzxl win11 | bit faster with import/namespace & no-cycle off |
| 2023-09-02#6 | 17s ±  0.3 s | 18.17.1 | romain nzxl win11 | bit faster with etc/no-internal off             |
| 2024-04-12#1 | 15s ±  0.4 s | 20.12.1 | romain nzxl win11 |                                                 |
