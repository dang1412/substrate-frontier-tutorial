#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
	dispatch::{Dispatchable, GetDispatchInfo, PostDispatchInfo},
};
use fp_evm::{
	PrecompileHandle,
};

use sp_std::{marker::PhantomData};
use pallet_evm::AddressMapping;
use precompile_utils::prelude::*;

pub struct CollectiblesPrecompile<Runtime>(PhantomData<Runtime>);

#[precompile_utils::precompile]
impl<Runtime> CollectiblesPrecompile<Runtime>
where
	Runtime: pallet_collectibles::Config + pallet_evm::Config,
	Runtime::RuntimeCall: Dispatchable<PostInfo = PostDispatchInfo> + GetDispatchInfo,
	<Runtime::RuntimeCall as Dispatchable>::RuntimeOrigin: From<Option<Runtime::AccountId>>,
	Runtime::RuntimeCall: From<pallet_collectibles::Call<Runtime>>,
{
	#[precompile::public("create_collectible()")]
    fn create_collectible(handle: &mut impl PrecompileHandle) -> EvmResult {
		let origin = Runtime::AddressMapping::into_account_id(handle.context().caller);

		let call = pallet_collectibles::Call::<Runtime>::create_collectible {};
		// Dispatch call (if enough gas).
		RuntimeHelper::<Runtime>::try_dispatch(handle, Some(origin).into(), call)?;

		Ok(())
    }

	#[precompile::public("transfer(address,uint128)")]
	fn transfer(
		handle: &mut impl PrecompileHandle,
		to: Address,
		unique_id: u128,
	) -> EvmResult {
		let origin = Runtime::AddressMapping::into_account_id(handle.context().caller);
		let to = Runtime::AddressMapping::into_account_id(to.into());

		let unique_id: [u8; 16] = unique_id.to_be_bytes().into();

		let call = pallet_collectibles::Call::<Runtime>::transfer {
			to,
			unique_id
		};
		// Dispatch call (if enough gas).
		RuntimeHelper::<Runtime>::try_dispatch(handle, Some(origin).into(), call)?;

		Ok(())
	}
}