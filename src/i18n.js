export const N = {
  en: {signs:['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'],
    el:['Fire','Earth','Air','Water'], mod:['Cardinal','Fixed','Mutable'],
    ph:['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'],
    ani:['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'],
    cel:['Wood','Fire','Earth','Metal','Water'], yy:['Yin','Yang'], ek:{total:'total',partial:'partial',penumbral:'penumbral',annular:'annular'}},
  pl: {signs:['Baran','Byk','Bliźnięta','Rak','Lew','Panna','Waga','Skorpion','Strzelec','Koziorożec','Wodnik','Ryby'],
    el:['Ogień','Ziemia','Powietrze','Woda'], mod:['Kardynalny','Stały','Zmienny'],
    ph:['Nów','Rosnący sierp','Pierwsza kwadra','Rosnący garb','Pełnia','Malejący garb','Ostatnia kwadra','Malejący sierp'],
    ani:['Szczur','Wół','Tygrys','Królik','Smok','Wąż','Koń','Koza','Małpa','Kogut','Pies','Świnia'],
    cel:['Drzewo','Ogień','Ziemia','Metal','Woda'], yy:['Yin','Yang'], ek:{total:'całkowite',partial:'częściowe',penumbral:'półcieniowe',annular:'obrączkowe'}}
};
export const S = {
  en: {disc:'For entertainment and self-reflection – not prediction.', today:'Today', me:'Me', journal:'Journal', settings:'Settings',
    moon:'Moon', illum:'Illumination', msign:'Moon sign', nnew:'Next new moon', nfull:'Next full moon', rise:'Moonrise', set:'Moonset', elL:'Next lunar eclipse', elS:'Next solar eclipse',
    west:'Western astrology', sun:'Sun sign', vedic:'Vedic (sidereal, Lahiri)', ssun:'Sidereal Sun', smoon:'Sidereal Moon', nak:'Nakshatra', ay:'Ayanamsa',
    cn:'Chinese calendar', animal:'Animal', elem:'Element', lunar:'Lunar date', num:'Numerology', life:'Life path', bday:'Birthday number', expr:'Expression', soul:'Soul urge', pers:'Personality', pday:'Personal day', pyear:'Personal year',
    bio:'Biorhythms', phys:'Physical (23d)', emo:'Emotional (28d)', intel:'Intellectual (33d)', gem:'Gematria', heb:'Hebrew letters', ord:'English ordinal (A=1…Z=26)', std:'English standard (A=1…J=10…Z=800)',
    maya:'Maya calendar', tz:"Tzolk'in", haab:"Haab'", lc:'Long Count', date:'Date', name:'Name', bdate:'Birth date (YYYY-MM-DD)', btime:'Birth time (HH:MM, optional)', bplace:'Birth place', find:'Find place', utc:'UTC offset at birth (hours)',
    save:'Save', saved:'Saved', mood:'Mood', energy:'Energy', sleep:'Sleep (hours)', add:'Save today', few:'Too few entries to conclude anything (need 14+).', avg:'Average mood by Moon phase', entries:'Entries',
    lang:'Language', sys:'Numerology system', pyth:'Pythagorean', chal:'Chaldean', how:'How', needTime:'Needs birth time – approximate (noon)', needBirth:'Enter your birth date in the Me tab',
    nphase:['New','Waxing','Full','Waning'], up:'Today', about:'Moon, planets and calendars are calculated. Their meanings are tradition, not science, and nothing here predicts your future.'},
  pl: {disc:'Rozrywka i refleksja – nie przewidywanie.', today:'Dziś', me:'Ja', journal:'Dziennik', settings:'Ustawienia',
    moon:'Księżyc', illum:'Oświetlenie', msign:'Znak Księżyca', nnew:'Najbliższy nów', nfull:'Najbliższa pełnia', rise:'Wschód Księżyca', set:'Zachód Księżyca', elL:'Następne zaćmienie Księżyca', elS:'Następne zaćmienie Słońca',
    west:'Astrologia zachodnia', sun:'Znak Słońca', vedic:'Wedyjska (gwiazdowa, Lahiri)', ssun:'Słońce gwiazdowe', smoon:'Księżyc gwiazdowy', nak:'Nakshatra', ay:'Ayanamsa',
    cn:'Kalendarz chiński', animal:'Zwierzę', elem:'Żywioł', lunar:'Data księżycowa', num:'Numerologia', life:'Liczba drogi życia', bday:'Liczba urodzin', expr:'Liczba wyrazu', soul:'Liczba duszy', pers:'Liczba osobowości', pday:'Dzień osobisty', pyear:'Rok osobisty',
    bio:'Biorytmy', phys:'Fizyczny (23 d)', emo:'Emocjonalny (28 d)', intel:'Intelektualny (33 d)', gem:'Gematria', heb:'Litery hebrajskie', ord:'Angielska porządkowa (A=1…Z=26)', std:'Angielska standardowa (A=1…J=10…Z=800)',
    maya:'Kalendarz Majów', tz:"Tzolk'in", haab:"Haab'", lc:'Długie Liczenie', date:'Data', name:'Imię', bdate:'Data urodzenia (RRRR-MM-DD)', btime:'Godzina urodzenia (GG:MM, opcjonalnie)', bplace:'Miejsce urodzenia', find:'Znajdź miejsce', utc:'Przesunięcie UTC w chwili urodzenia (godz.)',
    save:'Zapisz', saved:'Zapisano', mood:'Nastrój', energy:'Energia', sleep:'Sen (godziny)', add:'Zapisz dziś', few:'Za mało wpisów, żeby cokolwiek stwierdzić (potrzeba 14+).', avg:'Średni nastrój wg fazy Księżyca', entries:'Wpisy',
    lang:'Język', sys:'System numerologii', pyth:'Pitagorejski', chal:'Chaldejski', how:'Jak policzono', needTime:'Potrzebna godzina urodzenia – wartość przybliżona (południe)', needBirth:'Wpisz datę urodzenia w zakładce Ja',
    nphase:['Nów','Rosnący','Pełnia','Malejący'], up:'Dziś', about:'Księżyc, planety i kalendarze są liczone. Ich znaczenia to tradycja, a nie nauka, i nic tu nie przewiduje Twojej przyszłości.'}
};
Object.assign(N.en, {bod:['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'], ch7:['Saturn','Jupiter','Mars','Sun','Venus','Mercury','Moon'],
  use:['long-term plans, patience','legal, money, official matters','energetic or physical tasks','officials, authority, visibility','agreements, purchases, social','paperwork, calls, travel','home and family']});
Object.assign(N.pl, {bod:['Słońce','Księżyc','Merkury','Wenus','Mars','Jowisz','Saturn','Uran','Neptun','Pluton'], ch7:['Saturn','Jowisz','Mars','Słońce','Wenus','Merkury','Księżyc'],
  use:['plany długoterminowe, cierpliwość','sprawy prawne, pieniądze, urzędowe','zadania energiczne lub fizyczne','urzędnicy, autorytet, widoczność','umowy, zakupy, spotkania','papiery, rozmowy, podróże','dom i rodzina']});
Object.assign(S.en, {plan:'Plan', places:'Places', ldays:'Favourable days (Vedic Chandra & Tara Bala)', fav:'favourable', mix:'mixed', hard:'difficult', hrsFor:'Planetary hours for', where:'Location for hours', rahu:'Rahu Kalam (traditionally avoided)', abh:'Abhijit (traditionally favourable)',
  errands:'Best for errands and paperwork', needTime2:'Needs birth date and time', topP:'Traditionally harmonious places', lowP:'Traditionally more challenging', chk:'Check a place', chkB:'Check', none:'No planetary line within 5° of this place',
  pdisc:'Traditional astrocartography. NOT a guide to where you should live – work, cost, family and climate matter far more.', pnote:'MC career/visibility · IC home · ASC self · DSC relationships. Birth time matters: an hour shifts lines by 15°.', sunriseSet:'Sunrise / sunset', night:'night'});
Object.assign(S.pl, {plan:'Plan', places:'Miejsca', ldays:'Sprzyjające dni (wedyjskie Chandra i Tara Bala)', fav:'sprzyjający', mix:'mieszany', hard:'trudny', hrsFor:'Godziny planetarne na', where:'Miejsce dla godzin', rahu:'Rahu Kalam (tradycyjnie unikany)', abh:'Abhijit (tradycyjnie sprzyjający)',
  errands:'Najlepsze do załatwiania spraw i papierów', needTime2:'Potrzebna data i godzina urodzenia', topP:'Miejsca tradycyjnie harmonijne', lowP:'Miejsca tradycyjnie trudniejsze', chk:'Sprawdź miejsce', chkB:'Sprawdź', none:'Brak linii planet w promieniu 5° od tego miejsca',
  pdisc:'Tradycyjna astrokartografia. To NIE wskazówka, gdzie mieszkać – praca, koszty, rodzina i klimat znaczą znacznie więcej.', pnote:'MC kariera/widoczność · IC dom · ASC ja · DSC relacje. Godzina urodzenia ma znaczenie: godzina przesuwa linie o 15°.', sunriseSet:'Wschód / zachód Słońca', night:'noc'});
Object.assign(N.en, {incaM:['"month of creating" – rainy season, fasts and rites','"great ripening" – crops grow in the rain','"ripening of the earth" – first produce','feast of the ruler – maize ripens','harvest, filling the storehouses','feast of the Sun at the June solstice (shortest day in the south)','dividing and preparing the fields','ploughing and sowing, offerings to Mother Earth (Pachamama)','feast of the queen and the Moon, cleansing the city of illness','prayers for rain','time of remembering the dead','great feast of the Sun at the December solstice, initiation of young men'],
  sol:['Inti Raymi – June solstice','Qhapaq Raymi – December solstice'],
  dark:"Dark constellations (shapes in the dark clouds of the Milky Way): Mach'akuay snake, Hamp'atu toad, Yutu partridge, Yacana llama with its young, Atoq fox. Qullqa (Pleiades) – the \"storehouse\"."});
Object.assign(N.pl, {incaM:['„miesiąc tworzenia” – pora deszczowa, posty i obrzędy','„wielkie dojrzewanie” – rośliny rosną w deszczu','„dojrzewanie ziemi” – pierwsze plony','święto władcy – dojrzewa kukurydza','zbiory i napełnianie spichrzy','święto Słońca w czasie przesilenia czerwcowego (najkrótszy dzień na południu)','podział i przygotowanie pól','orka i siew, ofiary dla Matki Ziemi (Pachamama)','święto królowej i Księżyca, oczyszczanie miasta z chorób','prośby o deszcz','czas pamięci o zmarłych','wielkie święto Słońca przy przesileniu grudniowym, inicjacja młodych mężczyzn'],
  sol:['Inti Raymi – przesilenie czerwcowe','Qhapaq Raymi – przesilenie grudniowe'],
  dark:"Ciemne gwiazdozbiory (kształty w ciemnych obłokach Drogi Mlecznej): wąż Mach'akuay, ropucha Hamp'atu, kuropatwa Yutu, lama Yacana z młodym, lis Atoq. Qullqa (Plejady) – „spichlerz”."});
Object.assign(S.en, {mayaT:'Maya', incaT:'Inca', inca:'Inca calendar', imonth:'Inca month', isunP:'Last solstice feast', isunN:'Next solstice feast', ago:'days ago', inD:'in', dd:'days',
  incaNote:'The Incas had no birth horoscope – this is cultural information, not a reading. Their months were lunar; this matching to calendar months is approximate.'});
Object.assign(S.pl, {mayaT:'Majowie', incaT:'Inkowie', inca:'Kalendarz Inków', imonth:'Miesiąc inkaski', isunP:'Ostatnie święto przesilenia', isunN:'Następne święto przesilenia', ago:'dni temu', inD:'za', dd:'dni',
  incaNote:'Inkowie nie mieli horoskopu urodzeniowego – to informacja o kulturze, nie wróżba. Ich miesiące były księżycowe; dopasowanie do miesięcy kalendarza jest przybliżone.'});
