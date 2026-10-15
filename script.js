document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const packageInputs = Array.from(document.querySelectorAll('.package-options input[type="radio"]'));
  const priceDisplay = document.getElementById('package-price');
  const packageCards = Array.from(document.querySelectorAll('.pricing-card--selectable'));
  const contactSection = document.getElementById('contact');

  const packagePrices = {
    Standard: 'Cena: od 1 250 Kč',
    Plus: 'Cena: od 1 650 Kč',
    Komplet: 'Cena: od 2 250 Kč',
    'Komplet Nano': 'Cena: od 6 950 Kč',
    'EXTERIÉR Nano': 'Cena: od 5 500 Kč',
    'Hloubkové tepování koberců': 'Cena: od 60 Kč / m²',
    'Tepování sedaček a čalouněného nábytku': 'Cena: od 300 Kč / sedací místo',
    Ostatní: 'Cena: Dle dohody'
  };

  function updatePrice(value) {
    if (priceDisplay) {
      priceDisplay.textContent = packagePrices[value] || 'Cena: Dle dohody';
    }
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      const name = form.querySelector('#fullname');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        event.preventDefault();
        alert('Prosím vyplňte všechna pole formuláře.');
      }
    });
  }

  if (packageInputs.length) {
    packageInputs.forEach(function (input) {
      input.addEventListener('change', function () {
        updatePrice(this.value);
      });
    });

    const checkedInput = packageInputs.find(function (input) {
      return input.checked;
    });

    if (checkedInput) {
      updatePrice(checkedInput.value);
    }
  }

  if (packageCards.length) {
    function selectPackageFromCard(card) {
      const selectedPackage = card.getAttribute('data-package');
      const matchingInput = document.querySelector('.package-options input[value="' + selectedPackage + '"]');

      if (matchingInput) {
        matchingInput.checked = true;
        updatePrice(selectedPackage);
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    packageCards.forEach(function (card) {
      card.addEventListener('click', function () {
        selectPackageFromCard(card);
      });

      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectPackageFromCard(card);
        }
      });
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const comparisonSliders = Array.from(document.querySelectorAll('.comparison-slider'));
  comparisonSliders.forEach(function (slider) {
    const range = slider.querySelector('.comparison-range');
    function setSplit(value) {
      slider.style.setProperty('--split', value + '%');
      range.setAttribute('aria-valuetext', value + '% odkryto pravou fotografii');
    }
    if (range) {
      setSplit(range.value);
      range.addEventListener('input', function () { setSplit(this.value); });
      slider.addEventListener('pointerdown', function (event) {
        if (event.target === range) return;
        const rect = slider.getBoundingClientRect();
        const value = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
        range.value = value;
        setSplit(value);
      });
    }
  });

  const comparisonCards = Array.from(document.querySelectorAll('.comparison-card'));
  const comparisonDialog = document.querySelector('.comparison-lightbox');
  if (comparisonDialog && comparisonCards.length) {
    const largeSlider = comparisonDialog.querySelector('.comparison-slider-large');
    const beforeImage = largeSlider.querySelector('.comparison-before');
    const afterImage = largeSlider.querySelector('.comparison-after');
    const range = comparisonDialog.querySelector('.comparison-lightbox-range');
    const caption = comparisonDialog.querySelector('.comparison-lightbox-caption');
    let currentComparison = 0;
    function setLargeSplit(value) {
      largeSlider.style.setProperty('--split', value + '%');
      range.value = value;
      range.setAttribute('aria-valuetext', value + '% odkryto fotografii po čištění');
    }
    function showComparison(index) {
      currentComparison = (index + comparisonCards.length) % comparisonCards.length;
      const card = comparisonCards[currentComparison];
      const slider = card.querySelector('.comparison-slider');
      const before = slider.querySelector('.comparison-before');
      const after = slider.querySelector('.comparison-after');
      beforeImage.src = before.currentSrc || before.src;
      afterImage.src = after.currentSrc || after.src;
      beforeImage.alt = before.alt;
      afterImage.alt = after.alt;
      caption.textContent = (card.querySelector('.comparison-title')?.textContent || 'Porovnání fotografií') + ' · ' + (currentComparison + 1) + ' / ' + comparisonCards.length;
      setLargeSplit(50);
    }
    comparisonCards.forEach((card, index) => {
      const slider = card.querySelector('.comparison-slider');
      slider.setAttribute('tabindex', '0');
      slider.setAttribute('role', 'button');
      slider.setAttribute('aria-label', 'Otevřít porovnání na celou obrazovku');
      function openComparison() {
        showComparison(index);
        if (typeof comparisonDialog.showModal === 'function') {
          if (!comparisonDialog.open) comparisonDialog.showModal();
        } else {
          comparisonDialog.setAttribute('open', '');
          comparisonDialog.style.position = 'fixed';
          comparisonDialog.style.inset = '2vh 2vw';
          comparisonDialog.style.margin = 'auto';
          comparisonDialog.style.zIndex = '99999';
        }
      }
      slider.addEventListener('click', function(event) {
        if (event.target.closest('.comparison-range')) return;
        openComparison();
      });
      slider.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openComparison(); }
      });
      const openButton = card.querySelector('.comparison-open-btn');
      if (openButton) {
        openButton.addEventListener('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          openComparison();
        });
      }
    });
    range.addEventListener('input', () => setLargeSplit(range.value));
    largeSlider.addEventListener('pointerdown', function(event) {
      if (event.target === range) return;
      const rect = largeSlider.getBoundingClientRect();
      setLargeSplit(Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)));
    });
    comparisonDialog.querySelector('.comparison-lightbox-close').addEventListener('click', () => {
      if (typeof comparisonDialog.close === 'function') comparisonDialog.close();
      else comparisonDialog.removeAttribute('open');
    });
    comparisonDialog.querySelector('.comparison-lightbox-prev').addEventListener('click', () => showComparison(currentComparison - 1));
    comparisonDialog.querySelector('.comparison-lightbox-next').addEventListener('click', () => showComparison(currentComparison + 1));
    comparisonDialog.addEventListener('click', function(event) { if (event.target === comparisonDialog) comparisonDialog.close(); });
    document.addEventListener('keydown', function(event) {
      if (!comparisonDialog.open) return;
      if (event.key === 'ArrowLeft') showComparison(currentComparison - 1);
      if (event.key === 'ArrowRight') showComparison(currentComparison + 1);
    });
  }

});
