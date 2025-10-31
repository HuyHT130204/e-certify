use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use mpl_bubblegum::program::Bubblegum;
use spl_account_compression::{program::SplAccountCompression, Noop};

declare_id!("CRD111111111111111111111111111111111111111");

#[program]
pub mod credify_program {
    use super::*;

    pub fn create_tree(
        ctx: Context<CreateTree>,
        _max_depth: u32,
        _max_buffer_size: u32,
    ) -> Result<()> {
        // NOTE: For the MVP scaffold we only record intent and authority PDA.
        // In a production version, add CPI calls to allocate and init the tree
        // via spl_account_compression and mpl_bubblegum with the PDA authority.
        msg!(
            "Merkle Tree created successfully with authority: {}",
            ctx.accounts.tree_authority.key()
        );
        Ok(())
    }

    pub fn transfer_credential<'info>(
        _ctx: Context<'_, '_, '_, 'info, TransferCredential<'info>>,
        _root: [u8; 32],
        _data_hash: [u8; 32],
        _creator_hash: [u8; 32],
        _nonce: u64,
        _index: u32,
    ) -> Result<()> {
        // Placeholder for CPI to mpl_bubblegum::cpi::transfer
        Ok(())
    }

    pub fn burn_credential<'info>(
        _ctx: Context<'_, '_, '_, 'info, BurnCredential<'info>>,
        _root: [u8; 32],
        _data_hash: [u8; 32],
        _creator_hash: [u8; 32],
        _nonce: u64,
        _index: u32,
    ) -> Result<()> {
        // Placeholder for CPI to mpl_bubblegum::cpi::burn
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_max_depth: u32, _max_buffer_size: u32)]
pub struct CreateTree<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        seeds = [b"authority"],
        bump
    )]
    pub tree_authority: SystemAccount<'info>,

    #[account(mut)]
    /// CHECK: Unchecked for scaffold; real impl must validate
    pub merkle_tree: UncheckedAccount<'info>,

    pub bubblegum_program: Program<'info, Bubblegum>,
    pub compression_program: Program<'info, SplAccountCompression>,
    pub log_wrapper: Program<'info, Noop>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferCredential<'info> {
    #[account(
        seeds = [b"authority"],
        bump
    )]
    pub tree_authority: SystemAccount<'info>,

    /// CHECK: Owner signer
    #[account(signer)]
    pub leaf_owner: UncheckedAccount<'info>,
    /// CHECK: New owner
    pub leaf_delegate: UncheckedAccount<'info>,
    /// CHECK: Merkle tree
    #[account(mut)]
    pub merkle_tree: UncheckedAccount<'info>,

    pub log_wrapper: Program<'info, Noop>,
    pub compression_program: Program<'info, SplAccountCompression>,
    pub bubblegum_program: Program<'info, Bubblegum>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BurnCredential<'info> {
    #[account(
        seeds = [b"authority"],
        bump
    )]
    pub tree_authority: SystemAccount<'info>,

    /// CHECK: Owner signer
    #[account(signer)]
    pub leaf_owner: UncheckedAccount<'info>,
    /// CHECK: Merkle tree
    #[account(mut)]
    pub merkle_tree: UncheckedAccount<'info>,

    pub log_wrapper: Program<'info, Noop>,
    pub compression_program: Program<'info, SplAccountCompression>,
    pub bubblegum_program: Program<'info, Bubblegum>,
    pub system_program: Program<'info, System>,
}



