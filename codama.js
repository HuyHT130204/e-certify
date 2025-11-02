// All code and comments must be in English.

/** @type {import('codama').CodamaConfig} */
module.exports = {
  idl: {
    filePath: './target/idl/e_certify_program.json',
  },
  program: {
    publicKey: '...YourProgramID...', // <-- REPLACE THIS
  },
  output: {
    filePath: './lib/solana/program.ts',
  },
};



