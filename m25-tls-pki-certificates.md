# Module 12: TLS, PKI & Certificates

**Level:** 2 · **Lessons:** 7 · **Questions:** 6

_Understand, deploy and troubleshoot TLS and certificates across cloud services._

## Lesson 1: Why TLS and how the handshake works

**TLS** gives three guarantees: **confidentiality** (encryption), **integrity** (tampering is detected) and **authentication** (you are talking to the real server). It protects HTTPS, secure email, database connections, VPNs built on TLS, and service-to-service APIs.

A **TLS 1.3** handshake takes one round trip:

1. **ClientHello**: supported versions and cipher suites, a key share for **ECDHE** key exchange, the **SNI** (server name the client wants) and **ALPN** (application protocol, such as `h2` for HTTP/2).
2. **ServerHello**: the server picks parameters and sends its key share. From here everything is encrypted.
3. The server sends its **certificate** and a **CertificateVerify** signature proving it holds the private key, then **Finished**.
4. The client validates the certificate, sends **Finished**, and application data flows.

ECDHE gives **forward secrecy**: even if the server's private key leaks later, past sessions can't be decrypted. TLS 1.3 removed old, weak options; TLS 1.2 is still acceptable with modern cipher suites (ECDHE with AES-GCM or ChaCha20-Poly1305). TLS 1.0 and 1.1 are obsolete and should be disabled.

> **Tip:** **SNI** is why one IP address can host hundreds of HTTPS sites: the load balancer reads the requested name from the ClientHello and picks the matching certificate.

## Lesson 2: Certificates and chains of trust

A **certificate** (X.509) binds a public key to identities and is signed by a **certificate authority (CA)**. Key fields:

- **Subject Alternative Name (SAN)**: the DNS names (or IPs) the certificate is valid for. Browsers check the SAN, not the old Common Name.
- **Validity**: not-before and not-after dates.
- **Issuer**: the CA that signed it.
- **Key usage**: what the key may be used for (server auth, client auth).

Clients trust a small set of **root CAs** built into the operating system or browser. Roots sign **intermediate CAs**, which sign server certificates. The server must send its certificate **plus the intermediates** (the **chain**); clients already have the root.

A **wildcard** certificate (`*.example.com`) covers one level of subdomains (`api.example.com`, not `v1.api.example.com`).

**Lifetimes are shrinking.** The CA/Browser Forum has agreed to phase down the maximum validity of publicly trusted TLS certificates: 200 days from March 2026, 100 days from March 2027, and 47 days from March 2029. Manual renewal no longer scales.

**Inspect a server's chain and dates**

```
openssl s_client -connect app.example.com:443 -servername app.example.com -showcerts </dev/null
echo | openssl s_client -connect app.example.com:443 -servername app.example.com 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

> **Watch out:** "Works in my browser but fails in curl or Java" usually means the server isn't sending its intermediate certificate. Browsers sometimes fetch it themselves; other clients don't.

## Lesson 3: Automating certificates with ACME

**ACME** (RFC 8555) is the protocol behind **Let's Encrypt** and many other CAs. A client proves control of a domain and receives a certificate automatically:

- **HTTP-01** challenge: serve a token at `http://<domain>/.well-known/acme-challenge/...`
- **DNS-01** challenge: create a TXT record `_acme-challenge.<domain>`; required for wildcard certificates and handy when servers aren't publicly reachable.
- **TLS-ALPN-01**: answer a special TLS handshake on port 443.

Popular clients: **certbot**, **acme.sh**, **lego**, **Caddy** (built-in), and **cert-manager** for Kubernetes, which issues and renews certificates as Kubernetes resources.

**Get a certificate with certbot using the Nginx plugin**

```
sudo certbot --nginx -d app.example.com -d www.example.com
sudo certbot renew --dry-run      # test automatic renewal
```

> **Tip:** Monitor expiry independently of the renewal system: an alert 14–21 days before expiry catches broken automation before users do.

## Lesson 4: Certificate services in the four clouds

Managed certificate services handle issuance, storage and renewal for cloud load balancers and CDNs:

- **AWS Certificate Manager (ACM)**: free public certificates (DNS or email validation) that renew automatically when attached to ALB, NLB, CloudFront or API Gateway; imported certificates; **AWS Private CA** for private PKI.
- **Azure**: **Key Vault** stores and can auto-renew certificates (with integrated CAs), used by Application Gateway and Front Door; Front Door and App Service also offer free managed certificates.
- **Google Cloud**: **Certificate Manager** provides Google-managed certificates (including DNS authorization and wildcards) for load balancers; **Certificate Authority Service** runs private CAs.
- **OCI**: **OCI Certificates** issues and manages certificates (including from private CAs) and integrates with OCI Load Balancer and API Gateway.

> **In the cloud:** Terminate public TLS at the managed load balancer or CDN with a managed certificate, and use private CA certificates (or the platform's built-in options) for backend and service-to-service encryption.

## Lesson 5: Mutual TLS and private PKI

In normal TLS only the server proves its identity. In **mutual TLS (mTLS)** the client also presents a certificate, so both sides are authenticated cryptographically. It is used for:

- Service-to-service traffic in zero-trust architectures and service meshes (Istio, Linkerd issue short-lived certificates automatically)
- APIs for partners and IoT devices
- Securing connections to databases and message brokers

mTLS needs a **private PKI**: a private root CA (kept offline or in an HSM), intermediate CAs for issuing, short certificate lifetimes, automated rotation and a revocation plan. Managed options include AWS Private CA, Google Certificate Authority Service and OCI Certificates; tools such as HashiCorp Vault and cert-manager are also common.

Many cloud load balancers can verify client certificates: AWS ALB mutual authentication, Azure Application Gateway mutual authentication, Google Cloud load balancer mTLS with a trust config, and OCI Load Balancer client certificate verification.

> **Tip:** Keep mTLS certificates short-lived (hours to days) and automate rotation. Short lifetimes reduce the need for revocation checking.

## Lesson 6: Troubleshooting TLS

Most TLS failures fall into a few categories:

- **Expired certificate**: check the not-after date.
- **Name mismatch**: the requested host name isn't in the SAN list (often after adding a new domain).
- **Incomplete chain**: intermediate missing on the server.
- **Untrusted issuer**: a private CA the client doesn't trust, or a TLS-inspection proxy re-signing traffic.
- **Protocol or cipher mismatch**: an old client needs TLS 1.0, or a hardened server rejects the client's ciphers.
- **Wrong SNI**: the client doesn't send SNI, so the server returns its default certificate.
- **Clock skew**: a device with the wrong date thinks valid certificates are expired or not yet valid.

**Quick TLS checks**

```
curl -vI https://app.example.com 2>&1 | grep -E 'SSL|TLS|subject|issuer|expire|error'
openssl s_client -connect app.example.com:443 -servername app.example.com -tls1_2 </dev/null
openssl s_client -connect app.example.com:443 -servername wrong.example.com </dev/null  # test SNI behaviour
```

> **Watch out:** Never "fix" TLS errors in production by disabling certificate verification (curl -k, verify=False). Fix the certificate or trust store instead.

## Lesson 7: Real-world scenario: the certificate that expired on a Sunday

**Situation.** At 03:00 on a Sunday, a company's mobile app stops working for all users. The website works in browsers, but the app shows a network error. The API's certificate expired at midnight UTC.

**Investigation.**

1. `openssl s_client` confirms the API certificate's not-after date has passed.
2. The website uses a managed certificate on the CDN that renews automatically. The API, on a separate load balancer, used a manually imported certificate that someone renewed by hand each year. That person had left the company.
3. Browsers were unaffected because they were going to a different, still-valid certificate.

**Fix.**

1. Issue a new certificate (using the cloud's managed certificate service with DNS validation) and attach it. Service restored within an hour of the on-call engineer starting.
2. Replace every manually managed public certificate with managed or ACME-automated certificates.
3. Add certificate expiry monitoring with alerts at 30, 14 and 7 days, independent of the renewal system.
4. Keep an inventory of every certificate, its owner and where it's deployed.

**Lessons learned.** Manual certificate renewal fails eventually, usually at a bad time. With certificate lifetimes shrinking to 200 days now and 47 days by 2029, automation is mandatory.

## Key takeaways

- TLS 1.3 negotiates keys with ECDHE and authenticates the server with a certificate.
- Clients trust a certificate through a chain up to a root CA; send the full chain.
- Public certificate lifetimes are shrinking, so automate issuance and renewal.
- mTLS authenticates both sides and is the backbone of zero-trust service traffic.

## Checkpoint

**Q1. What does SNI let a server do?**

A. Encrypt traffic faster
B. Choose the right certificate for the requested host name on a shared IP  ✓
C. Skip certificate validation
D. Use UDP instead of TCP

_The client sends the host name in the ClientHello, so the server can pick the matching certificate._

**Q2. Clients other than browsers fail with "unable to get local issuer certificate". The most likely cause?**

A. The certificate expired
B. The server isn't sending the intermediate certificate  ✓
C. The client has no Internet
D. The wrong port is used

_Servers must send the full chain; browsers sometimes hide this mistake._

**Q3. Which ACME challenge is required for wildcard certificates?**

A. HTTP-01
B. DNS-01  ✓
C. TLS-ALPN-01
D. Email validation

_Wildcards need DNS-01 proof of control of the whole domain._

**Q4. What property does ECDHE key exchange provide?**

A. Smaller certificates
B. Forward secrecy  ✓
C. Client authentication
D. DNS validation

_Ephemeral keys mean a later key compromise can't decrypt past sessions._

**Q5. In mutual TLS, who presents a certificate?**

A. Only the server
B. Only the client
C. Both client and server  ✓
D. Neither; it uses passwords

_mTLS authenticates both sides with certificates._

**Q6. What is the most durable fix for expired-certificate outages?**

A. Buy certificates with longer validity
B. Automate issuance and renewal, and monitor expiry independently  ✓
C. Disable certificate checks in the app
D. Renew all certificates on the same day each year

_Automation plus independent monitoring prevents surprise expirations._

## Official reading

- [Cloudflare Learning: what happens in a TLS handshake](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/)
- [Let's Encrypt: how it works](https://letsencrypt.org/how-it-works/)
- [AWS Certificate Manager](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html)
- [Google Cloud Certificate Manager](https://cloud.google.com/certificate-manager/docs/overview)
- [CA/Browser Forum](https://cabforum.org/)
