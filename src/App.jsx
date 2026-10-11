
import { useEffect, useState } from "react";
import "./App.css";

const weddingDate = new Date("2027-06-20T08:00:00+07:00");

const initialWishes = [
  {
    name: "Alya",
    attendance: "Hadir",
    message: "Selamat menempuh hidup baru! Semoga selalu bahagia 🤍",
  },
  {
    name: "Rizky",
    attendance: "Hadir",
    message: "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
  },
];

function getStoredData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const guestName =
    new URLSearchParams(window.location.search).get("untuk") || "Tamu Undangan";

  const [opened, setOpened] = useState(false);
  const [remaining, setRemaining] = useState({});
  const [musicOn, setMusicOn] = useState(false);
  const [wishes, setWishes] = useState(() =>
    getStoredData("bayu-nanda-wishes", initialWishes)
  );
  const [attendance, setAttendance] = useState("Hadir");
  const [guestCount, setGuestCount] = useState("2");
  const [guest, setGuest] = useState("");
  const [message, setMessage] = useState("");
  const [giftCopied, setGiftCopied] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const diff = Math.max(0, weddingDate.getTime() - Date.now());

      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        finished: diff === 0,
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("bayu-nanda-wishes", JSON.stringify(wishes));
  }, [wishes]);

  useEffect(() => {
    if (!opened) return;

    const sections = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [opened]);

  function openInvitation() {
    setOpened(true);
    setTimeout(() => {
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText("1234567890");
      setGiftCopied(true);
      setNotice("Nomor rekening berhasil disalin.");
    } catch {
      setNotice("Salin nomor rekening secara manual: 1234567890");
    }
  }

  function submitWish(event) {
    event.preventDefault();

    if (!guest.trim() || !message.trim()) {
      setNotice("Isi nama dan ucapan terlebih dahulu.");
      return;
    }

    const newWish = {
      name: guest.trim(),
      attendance,
      count: attendance === "Hadir" ? guestCount : "0",
      message: message.trim(),
    };

    setWishes((current) => [newWish, ...current]);
    setGuest("");
    setMessage("");
    setNotice("Terima kasih! Ucapan berhasil ditambahkan.");
  }

  function toggleMusic() {
    const audio = document.getElementById("wedding-audio");
    if (!audio) return;

    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    } else {
      audio.play()
        .then(() => setMusicOn(true))
        .catch(() => setNotice("Tambahkan file musik di public/music.mp3."));
    }
  }

  return (
    <div className="wedding-app">
      <audio id="wedding-audio" loop>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {!opened && (
        <div className="cover">
          <div className="cover-image" />
          <div className="cover-shade" />

          <div className="cover-content">
            <p className="eyebrow">THE WEDDING OF</p>
            <h1 className="cover-names">
              Bayu <span>&</span> Nanda
            </h1>
            <p className="cover-date">20 . 06 . 2027</p>

            <div className="guest-card">
              <p>Kepada Yth.</p>
              <h2>{guestName}</h2>
              <p>Tanpa mengurangi rasa hormat, kami mengundang Anda.</p>
              <button className="button button-light" onClick={openInvitation}>
                <span>✉</span> Buka Undangan
              </button>
            </div>
          </div>
          <span className="cover-bottom">WITH LOVE, BAYU & NANDA</span>
        </div>
      )}

      {opened && (
        <>
          <nav className="bottom-nav">
            <a href="#home" aria-label="Beranda">⌂</a>
            <a href="#couple" aria-label="Mempelai">♡</a>
            <a href="#event" aria-label="Acara">▦</a>
            <a href="#gallery" aria-label="Galeri">▧</a>
            <a href="#wishes" aria-label="Ucapan">✉</a>
          </nav>

          <button
            className="music-button"
            onClick={toggleMusic}
            aria-label="Putar atau hentikan musik"
          >
            {musicOn ? "♫" : "♪"}
          </button>

          <section id="home" className="hero">
            <div className="hero-image" />
            <div className="hero-overlay" />
            <div className="hero-content">
              <p className="eyebrow">A CELEBRATION OF LOVE</p>
              <h1>Bayu <span>&</span> Nanda</h1>
              <p className="hero-description">
                Dengan penuh rasa syukur, kami mengundang Anda untuk
                menjadi bagian dari hari bahagia kami.
              </p>
              <div className="ornament">❦</div>
              <p className="hero-date">MINGGU, 20 JUNI 2027</p>
              <a className="button button-light" href="#couple">
                Lihat Undangan ↓
              </a>
            </div>
          </section>

          <section className="intro section reveal">
            <p className="eyebrow">BISMILLAHIRRAHMANIRRAHIM</p>
            <div className="ornament">❦</div>
            <p className="intro-text">
              Atas izin Allah SWT, kami bermaksud menyelenggarakan
              pernikahan putra-putri kami. Merupakan suatu kehormatan
              bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
              untuk memberikan doa restu.
            </p>
            <p className="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          </section>

          <section id="couple" className="couple section">
            <div className="section-heading reveal">
              <p className="eyebrow">TWO SOULS, ONE HEART</p>
              <h2>Pasangan Mempelai</h2>
              <p>Dua hati yang dipertemukan dalam satu perjalanan.</p>
            </div>

            <div className="couple-grid">
              <article className="person-card reveal">
                <div className="portrait portrait-bayu" />
                <p className="person-label">THE GROOM</p>
                <h3>Bayu Syeh Insani</h3>
                <p>Putra dari</p>
                <p className="parent-name">Bapak Jayadi & Ibu Sani</p>
              </article>

              <div className="couple-ampersand reveal">&</div>

              <article className="person-card reveal">
                <div className="portrait portrait-nanda" />
                <p className="person-label">THE BRIDE</p>
                <h3>Nanda Putri</h3>
                <p>Putri dari</p>
                <p className="parent-name">Bapak Denis & Almh. Ibu Ella</p>
              </article>
            </div>
          </section>

          <section className="quote-section section">
            <div className="quote-inner reveal">
              <p className="eyebrow">A VERSE ABOUT LOVE</p>
              <div className="ornament">❦</div>
              <blockquote>
                “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia
                menciptakan untukmu pasangan hidup dari jenismu sendiri,
                supaya kamu merasa tenteram kepadanya.”
              </blockquote>
              <p className="quote-source">QS. Ar-Rum: 21 (kutipan makna)</p>
            </div>
          </section>

          <section id="event" className="event section">
            <div className="section-heading reveal">
              <p className="eyebrow">SAVE THE DATE</p>
              <h2>Menuju Hari Bahagia</h2>
              <p>Dengan bahagia, kami menantikan kehadiran Anda.</p>
            </div>

            <div className="countdown reveal">
              {remaining.finished ? (
                <p className="countdown-finished">Hari bahagia telah tiba!</p>
              ) : (
                [
                  ["days", "Hari"],
                  ["hours", "Jam"],
                  ["minutes", "Menit"],
                  ["seconds", "Detik"],
                ].map(([key, label]) => (
                  <div className="count-box" key={key}>
                    <strong>{String(remaining[key] ?? 0).padStart(2, "0")}</strong>
                    <span>{label}</span>
                  </div>
                ))
              )}
            </div>

            <div className="event-grid">
              <article className="event-card reveal">
                <div className="event-icon">❧</div>
                <p className="person-label">ACARA PERTAMA</p>
                <h3>Akad Nikah</h3>
                <div className="event-divider" />
                <p>Minggu, 20 Juni 2027</p>
                <p>08.00 – 10.00 WIB</p>
                <p className="event-place">Gedung Serbaguna</p>
                <p>Jl. Contoh No. 10, Bandung</p>
                <a
                  className="button button-outline"
                  href="https://maps.google.com/?q=Gedung+Serbaguna+Bandung"
                  target="_blank"
                  rel="noreferrer"
                >
                  Lihat Lokasi ↗
                </a>
              </article>

              <article className="event-card reveal">
                <div className="event-icon">❦</div>
                <p className="person-label">ACARA KEDUA</p>
                <h3>Resepsi</h3>
                <div className="event-divider" />
                <p>Minggu, 20 Juni 2027</p>
                <p>11.00 – 14.00 WIB</p>
                <p className="event-place">Gedung Serbaguna</p>
                <p>Jl. Contoh No. 10, Bandung</p>
                <a
                  className="button button-outline"
                  href="https://maps.google.com/?q=Gedung+Serbaguna+Bandung"
                  target="_blank"
                  rel="noreferrer"
                >
                  Lihat Lokasi ↗
                </a>
              </article>
            </div>
          </section>

          <section className="story section">
            <div className="section-heading reveal">
              <p className="eyebrow">OUR JOURNEY</p>
              <h2>Cerita Kami</h2>
              <p>Setiap pertemuan memiliki ceritanya sendiri.</p>
            </div>

            <div className="timeline">
              <article className="timeline-item reveal">
                <span className="timeline-dot" />
                <p className="person-label">2022 · AWAL BERTEMU</p>
                <h3>Sebuah Pertemuan</h3>
                <p>
                  Dari pertemuan sederhana, kami mulai mengenal satu
                  sama lain dan menemukan banyak hal yang menyatukan.
                </p>
              </article>
              <article className="timeline-item reveal">
                <span className="timeline-dot" />
                <p className="person-label">2024 · BERTUMBUH</p>
                <h3>Melangkah Bersama</h3>
                <p>
                  Kami belajar saling memahami, tumbuh bersama, dan
                  menjaga harapan untuk masa depan.
                </p>
              </article>
              <article className="timeline-item reveal">
                <span className="timeline-dot" />
                <p className="person-label">2027 · SELAMANYA</p>
                <h3>Satu Tujuan</h3>
                <p>
                  Dengan restu keluarga, kami memilih untuk memulai
                  babak baru dan menjalani hidup bersama.
                </p>
              </article>
            </div>
          </section>

          <section id="gallery" className="gallery section">
            <div className="section-heading reveal">
              <p className="eyebrow">CAPTURED MOMENTS</p>
              <h2>Galeri Kami</h2>
              <p>Beberapa momen yang ingin kami kenang selamanya.</p>
            </div>

            <div className="gallery-grid">
              <img
                className="reveal"
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85"
                alt="Momen pernikahan"
                loading="lazy"
              />
              <img
                className="reveal"
                src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=85"
                alt="Dekorasi pernikahan"
                loading="lazy"
              />
              <img
                className="reveal"
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85"
                alt="Perayaan pernikahan"
                loading="lazy"
              />
              <img
                className="reveal"
                src="https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=900&q=85"
                alt="Momen romantis"
                loading="lazy"
              />
            </div>
          </section>

          <section className="gift section">
            <div className="gift-inner reveal">
              <p className="eyebrow">A LITTLE GIFT</p>
              <h2>Wedding Gift</h2>
              <div className="ornament">❦</div>
              <p>
                Doa restu Anda merupakan hadiah terindah bagi kami.
                Namun, apabila ingin memberikan tanda kasih, Anda
                dapat menggunakan informasi berikut.
              </p>

              <div className="bank-card">
                <span className="bank-name">BANK BCA · CONTOH</span>
                <p className="account-number">1234567890</p>
                <p>a.n. Bayu Pratama</p>
                <button
                  className="button button-outline"
                  onClick={copyAccount}
                >
                  {giftCopied ? "✓ Nomor Tersalin" : "Salin Nomor Rekening"}
                </button>
              </div>
              <p className="gift-note">
                Nomor rekening di atas hanya data demo. Ganti dengan
                informasi yang benar sebelum undangan dibagikan.
              </p>
            </div>
          </section>

          <section id="wishes" className="wishes section">
            <div className="section-heading reveal">
              <p className="eyebrow">LEAVE YOUR LOVE</p>
              <h2>RSVP & Ucapan</h2>
              <p>
                Konfirmasi kehadiran dan tuliskan doa terbaik untuk kami.
              </p>
            </div>

            <form className="wish-form reveal" onSubmit={submitWish}>
              <label htmlFor="guest-name">Nama</label>
              <input
                id="guest-name"
                value={guest}
                onChange={(event) => setGuest(event.target.value)}
                placeholder="Masukkan nama Anda"
                maxLength={80}
                required
              />

              <label htmlFor="attendance">Konfirmasi kehadiran</label>
              <select
                id="attendance"
                value={attendance}
                onChange={(event) => setAttendance(event.target.value)}
              >
                <option value="Hadir">Hadir</option>
                <option value="Tidak hadir">Tidak dapat hadir</option>
                <option value="Masih ragu">Masih ragu</option>
              </select>

              {attendance === "Hadir" && (
                <>
                  <label htmlFor="guest-count">Jumlah tamu</label>
                  <select
                    id="guest-count"
                    value={guestCount}
                    onChange={(event) => setGuestCount(event.target.value)}
                  >
                    <option value="1">1 orang</option>
                    <option value="2">2 orang</option>
                  </select>
                </>
              )}

              <label htmlFor="message">Ucapan dan doa</label>
              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tuliskan doa terbaik Anda..."
                rows="4"
                maxLength={500}
                required
              />

              <button className="button button-dark" type="submit">
                Kirim Ucapan ♡
              </button>
              {notice && <p className="notice" role="status">{notice}</p>}
            </form>

            <div className="wish-list">
              <p className="wish-total">
                {wishes.length} ucapan untuk Bayu & Nanda
              </p>
              {wishes.map((item, index) => (
                <article className="wish-item" key={`${item.name}-${index}`}>
                  <div className="wish-avatar">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{item.name}</h3>
                    <span className="attendance-label">{item.attendance}</span>
                    <p>{item.message}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <footer className="footer">
            <div className="ornament">❦</div>
            <p className="eyebrow">THANK YOU</p>
            <h2>Bayu <span>&</span> Nanda</h2>
            <p>
              Merupakan kebahagiaan bagi kami apabila Anda berkenan
              hadir dan memberikan doa restu.
            </p>
            <p className="footer-date">20 · 06 · 2027</p>
            <div className="footer-line" />
            <small>Made with love · Bayu & Nanda</small>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
