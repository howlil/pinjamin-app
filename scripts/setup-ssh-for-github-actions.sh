#!/bin/bash

# Script untuk setup SSH key untuk GitHub Actions
echo "🔑 Setting up SSH key untuk GitHub Actions deployment..."

# Generate new SSH key tanpa passphrase
ssh-keygen -t rsa -b 4096 -C "github-actions-pbf-deploy" -f ~/.ssh/pbf_github_deploy -N ""

echo ""
echo "✅ SSH key berhasil dibuat!"
echo ""
echo "📋 LANGKAH SELANJUTNYA:"
echo ""
echo "1. Copy PUBLIC KEY ini ke VM GCP Anda:"
echo "----------------------------------------"
cat ~/.ssh/pbf_github_deploy.pub
echo "----------------------------------------"
echo ""
echo "2. Di VM GCP, jalankan command ini:"
echo "   mkdir -p ~/.ssh"
echo "   echo '$(cat ~/.ssh/pbf_github_deploy.pub)' >> ~/.ssh/authorized_keys"
echo "   chmod 700 ~/.ssh"
echo "   chmod 600 ~/.ssh/authorized_keys"
echo ""
echo "3. Copy PRIVATE KEY ini ke GitHub Secrets (GCP_VM_SSH_PRIVATE_KEY):"
echo "----------------------------------------"
cat ~/.ssh/pbf_github_deploy
echo "----------------------------------------"
echo ""
echo "4. Test SSH connection:"
echo "   ssh -i ~/.ssh/pbf_github_deploy username@your-vm-ip"
echo ""
echo "✅ Setup selesai!" 