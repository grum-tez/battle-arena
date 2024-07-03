# #!/bin/bash

# # Define an associative array with the fighter data
# declare -A fighters=(
#     [1]="QmWAKjX1LUnb3v2jQJ3Zd9Gu32tFAewwtjZuABfczs6Mj2"
#     [2]="QmbpMjbgsFMaLVmtgJf1AdXRXwppJmuG5NGU44Bp9jqsKd"
#     [3]="QmRdCMxLtUCRNtiwpLsePFZ6QAAiZPtNxDUMUsvZuxoXeC"
#     [4]="QmNt7Xet8oLebiPeRTZCp4qF3CjhWG4itgpw9ZJmpywGz3"
#     [5]="QmSXByNYCu3VoF2Q6m9Gy8xugp7Va4XsuUvSMaMSjUD1ou"
#     [6]="QmPPW2Rg1GYoBbXbMbsh3Mk6m9BagdiVjcRpoLyxDkkFbc"
#     [7]="QmNutTRBNYoqCCmXCD1xkvQqNhY5DZBupcqUJhxSV3uHK1"
# )

# # Base URL of the IPFS gateway
# base_url="https://gateway.pinata.cloud/ipfs"

# # Loop through the fighters array and download each image
# for id in "${!fighters[@]}"; do
#     ipfs_hash="${fighters[$id]}"
#     output_file="${id}.jpg"  # You can change the file extension if the images are not jpg
#     url="${base_url}/${ipfs_hash}"
    
#     echo "Downloading $url to $output_file..."
#     curl -o "$output_file" "$url"
# done

# echo "Download completed."

# Define an associative array with the fighter data
declare -A fighters=(
    ["gnat"]="QmWAKjX1LUnb3v2jQJ3Zd9Gu32tFAewwtjZuABfczs6Mj2"
    ["mouse"]="QmbpMjbgsFMaLVmtgJf1AdXRXwppJmuG5NGU44Bp9jqsKd"
    ["termite"]="QmRdCMxLtUCRNtiwpLsePFZ6QAAiZPtNxDUMUsvZuxoXeC"
    ["skunk"]="QmNt7Xet8oLebiPeRTZCp4qF3CjhWG4itgpw9ZJmpywGz3"
    ["sloth"]="QmSXByNYCu3VoF2Q6m9Gy8xugp7Va4XsuUvSMaMSjUD1ou"
    ["dragon"]="QmPPW2Rg1GYoBbXbMbsh3Mk6m9BagdiVjcRpoLyxDkkFbc"
    ["nano-bots"]="QmNutTRBNYoqCCmXCD1xkvQqNhY5DZBupcqUJhxSV3uHK1"
)

# Base URL of the IPFS gateway
base_url="https://gateway.pinata.cloud/ipfs"

# Loop through the fighters array and download each image
for name in "${!fighters[@]}"; do
    ipfs_hash="${fighters[$name]}"
    output_file="${name}.jpg"  # You can change the file extension if the images are not jpg
    url="${base_url}/${ipfs_hash}"
    
    echo "Downloading $url to $output_file..."
    curl -o "$output_file" "$url"
done

echo "Download completed."