// the local binding is needed to set the prefix below, so a plain `export ... from` would skip it
// oxlint-disable-next-line unicorn/prefer-export-from
import { storage } from 'shuutils'

storage.prefix = 'ging_'

export { storage }
