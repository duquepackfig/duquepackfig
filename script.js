    const ageGate=document.getElementById('ageGate');
    const ageAccept=document.getElementById('ageAccept');
    const ageCancel=document.getElementById('ageCancel');
    const ageCountdown=document.getElementById('ageCountdown');
    ageAccept.setAttribute('aria-live','polite');
    const ageSessionKey='duquePackFigAgeConfirmed';
    const hasAgeConfirmation=()=>{try{return sessionStorage.getItem(ageSessionKey)==='true'}catch{return false}};
    const rememberAgeConfirmation=()=>{try{sessionStorage.setItem(ageSessionKey,'true')}catch{}};
    let ageTimer;
    const closeAgeGate=()=>{clearInterval(ageTimer);ageGate.classList.remove('is-open');ageGate.setAttribute('aria-hidden','true');document.body.classList.remove('age-locked')};
    const openAgeGate=(pack,paymentUrl)=>{clearInterval(ageTimer);let seconds=5;ageAccept.disabled=true;ageAccept.dataset.pack=pack;ageAccept.dataset.paymentUrl=paymentUrl;ageCountdown.textContent='Leia o aviso enquanto o botão é liberado.';ageAccept.textContent='AGUARDE '+seconds+' SEGUNDOS';ageGate.classList.add('is-open');ageGate.setAttribute('aria-hidden','false');document.body.classList.add('age-locked');ageTimer=setInterval(()=>{seconds-=1;if(seconds>0){ageAccept.textContent='AGUARDE '+seconds+' SEGUNDOS'}else{clearInterval(ageTimer);ageCountdown.textContent='Confirme sua maioridade para continuar.';ageAccept.textContent='SOU MAIOR DE 18 ANOS — CONTINUAR';ageAccept.disabled=false;ageAccept.focus()}},1000)};
    document.querySelectorAll('.buy-button[data-pack]').forEach(button=>button.addEventListener('click',event=>{const pack=button.dataset.pack;if(pack==='Master Combo'||pack==='Hot +18'){event.preventDefault();const paymentUrl=button.dataset.paymentUrl;if(hasAgeConfirmation()){if(paymentUrl)window.location.href=paymentUrl;return}openAgeGate(pack,paymentUrl)}}));
    ageCancel.addEventListener('click',closeAgeGate);
    ageAccept.addEventListener('click',()=>{if(ageAccept.disabled)return;const paymentUrl=ageAccept.dataset.paymentUrl;rememberAgeConfirmation();closeAgeGate();if(paymentUrl)window.location.href=paymentUrl});
    const previewVideos=document.querySelectorAll('.preview-video');
    const loadPreview=video=>{if(!video.src){video.src=video.dataset.src+(video.dataset.src.includes('?')?'&':'?')+'v=3';video.load()}video.play().catch(()=>{})};
    if('IntersectionObserver' in window){
      const previewObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){loadPreview(entry.target)}else{entry.target.pause()}}),{rootMargin:'260px'});
      previewVideos.forEach(video=>previewObserver.observe(video));
    }else{previewVideos.forEach(loadPreview)}
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&ageGate.classList.contains('is-open'))closeAgeGate()});
