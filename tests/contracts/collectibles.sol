// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

interface Collectibles {
    function create_collectible() external;
    function transfer(address to, uint128 unique_id) external;
}