/**
 * KYPO6 — NEWSROOM REGISTRY (front-page fiction database)
 * =============================================================================
 * Single source of truth for EVERYTHING the front page shows: desks, dispatches
 * (stories), personnel (authors), the weather bureau, the Spleen Exchange,
 * horoscopes, whispers, radio schedule, polls, historical editions, submission
 * forms, advertisements, mandates and warnings.
 *
 * This is DATA ONLY — plain ESM, no DOM, no dependencies. It loads in the
 * browser (via src/lib/newsroom.js) AND in Node (scripts/check-legacy-routes.mjs
 * validates its integrity).
 *
 * HONESTY RULE (same as the archive side): every dispatch in here is ORIGINAL
 * FICTION of the present, unaffiliated operator. Nothing from the former 2016
 * website is republished anywhere in this file, and the story modal prints a
 * standing disclosure line linking to /archive/ and /about/.
 *
 * Deep links (all handled by src/lib/newsroom.js):
 *   /?story=story-duchess      → opens a dispatch in the reader modal
 *   /?desk=calcium             → filters the front page to one desk
 *   /?feature=weather          → opens a structured feature panel
 */

/* -----------------------------------------------------------------------------
 * DESKS (the paper's sections — every nav button maps to one)
 * -------------------------------------------------------------------------- */
export const desks = [
  {
    id: 'calcium',
    name: 'CALCIUM SCANDALS',
    short: 'Calcium',
    editor: 'enoch-boneweaver',
    motto: 'Every skeleton is a rumour until weighed.',
    about:
      'The Calcium Desk covers the ongoing insurgency of the human and ceramic skeleton: bones that chatter without permission, teapots that develop clavicles, and the slow, dignified revolt of the elbow. Founded after the Great Knuckle Audit of 1971, the desk maintains the only licensed osteological tip line in the Basin.',
    accent: 'bg-white',
  },
  {
    id: 'royals',
    name: 'THE QUIET MONARCHY',
    short: 'Royals & Celebrity',
    editor: 'sister-beatrice',
    motto: 'The Crown drips. We hold the bucket.',
    about:
      'Palace watch, celebrity seepage, and the red carpet beat (the carpet is mostly jelly; see dispatches). Our correspondents are accredited to every gravy weigh-in and are frequently asked to leave. The desk also files the Hourly Gazette of Absence — obituaries of the living — under special coronial licence.',
    accent: 'bg-white',
  },
  {
    id: 'voids',
    name: 'DOMESTIC VOIDS',
    short: 'Voids',
    editor: 'burlap-higgins',
    motto: 'The hallway is longer than the house. Report accordingly.',
    about:
      'Stairs that refuse descent, attics that arrive uninvited, cupboards with weather systems. The Voids Desk measures, maps and occasionally feeds the gaps that open inside ordinary homes. Field staff carry rope, chalk, and a firm distrust of landings.',
    accent: 'bg-white',
  },
  {
    id: 'synthetic',
    name: 'UNLICENSED FAUNA',
    short: 'Fauna',
    editor: 'alois-voidgauntlet',
    motto: 'If it has no licence, it has a story.',
    about:
      'Creatures operating without paperwork: reverse-canines, migratory crickets, sullen lawns, and the occasional municipal wren knitted from bone splinters. The desk liaises (shouts) with the Basin Licensing Office, which has been closed since 1994 for reasons it refuses to state.',
    accent: 'bg-white',
  },
  {
    id: 'hexes',
    name: 'HEXES & MORTGAGES',
    short: 'Hexes',
    editor: 'thaddeus-grist',
    motto: 'Interest rates are a branch of witchcraft.',
    about:
      'Property curses, levitating outbuildings, air-rights disputes, and the fiscal weather. Our assessors are qualified in both surveying and salt-throwing. The desk also covers the Spleen Exchange, where PORK, BONE and MUD are traded under the 1922 Standard Tub Act.',
    accent: 'bg-amber-50',
  },
  {
    id: 'domestic',
    name: 'DOMESTIC PERILS',
    short: 'Domestic',
    editor: 'archie-clack',
    motto: 'The kitchen is a crime scene that keeps happening.',
    about:
      'Gravy with criminal intent, pantries holding elections, receipts that recognise footsteps. The Domestic Perils Desk treats every household appliance and condiment as a suspect until proven flavourful. Tip line: shout into the bread bin after sundown.',
    accent: 'bg-white',
  },
];

/* -----------------------------------------------------------------------------
 * PERSONNEL (authors — every byline is clickable and resolves here)
 * -------------------------------------------------------------------------- */
export const authors = {
  'sister-beatrice': {
    name: 'Sister Beatrice',
    role: 'Crown Mutton Attache',
    desk: 'royals',
    beat: 'Palace damp, royal appendages, vapour clerking',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    joined: '1974 (recruited from a wet wall in Carlisle)',
    dispatches: 418,
    bio: `Sister Beatrice has covered the Palace since the Condensation Accords of 1974, when she was discovered living inside a wet wall in Carlisle and immediately offered a press pass. She maintains the Department of Damp's only reliable hygrometer, calibrated weekly against the sigh of a disappointed duchess.
      Her investigative method is unusual but effective: she stands very still in stately corridors until the building confesses. Three ceilings have pleaded guilty. One chandelier named names.
      Beatrice refuses to explain where she was between 1968 and 1971, a period the paper's own archives describe only as "the gill years."`,
    quirks: ['Files copy exclusively in green ink', 'Hisses at fresh plaster', 'Claimed by two separate dioceses'],
    contact: 'Palace Damp Liaison Office, behind the third radiator, High Balmoral',
  },
  'archie-clack': {
    name: 'Archie Clack',
    role: 'Condiment Detective',
    desk: 'domestic',
    beat: 'Culinary crime, pantry politics, sauce-based fraud',
    avatar: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=200&q=80',
    joined: '1988 (previously a suspect)',
    dispatches: 302,
    bio: `Archie Clack joined the Domestic Perils Desk in 1988 after the paper's own custard was caught attempting to unionise the cutlery. He had been the custard's lawyer. We hired him anyway; the custard lost.
      Archie specialises in custodial interviews of semi-liquid persons and holds the Basin record for longest staring contest with a trifle (nine days; the trifle blinked first and was remanded).
      He writes, appropriately, in gravy boat longhand, and his copy frequently needs to be blotted before typesetting.`,
    quirks: ['Carries six spoons "for questioning"', 'Refers to all readers as "the jury"', 'Banned from three Harrogate buffets'],
    contact: 'Skittle Alley Press Box, Skipton (knock twice, wait for the slurping to stop)',
  },
  'gwendolyn-spittle': {
    name: 'Gwendolyn Spittle',
    role: 'Senior Fluff Academic',
    desk: 'domestic',
    beat: 'Navel legislation, paper conduct, small damp documents',
    avatar: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80',
    joined: '1991',
    dispatches: 265,
    bio: `Gwendolyn Spittle holds the Chair of Applied Lint at the Ministry of Wool's evening college and has published more than forty papers on the legislative behaviour of abdominal residue. Her landmark monograph, "Blue Fluff, Red Tape," remains required reading for anyone whose navel has been caught lobbying.
      She keeps every specimen she has ever collected in labelled pillboxes, and claims the collection now votes as a bloc in local elections.
      Gwendolyn also covers paper conduct — receipts, slips, doilies — a beat she describes as "watching wood pulp develop opinions."`,
    quirks: ['Never bathes before a deadline', 'Speaks to specimens in low Latin', 'Owns the only registered flannel in Cheshire'],
    contact: 'Ministry of Wool, Leeds (ask the doormat; it knows everyone)',
  },
  'enoch-boneweaver': {
    name: 'Enoch Bone-Weaver',
    role: 'Ceramic Osteopath',
    desk: 'calcium',
    beat: 'Skeletal ceramics, teapot pathology, knitting accidents',
    avatar: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80',
    joined: '1969',
    dispatches: 511,
    bio: `Enoch Bone-Weaver has run the Calcium Desk since 1969, when he first heard a Wedgwood soup tureen hum a hymn during a funeral tea. He is a qualified ceramic osteopath — the only one — and his consulting room above the Crewe antique market smells of bone china and iodine.
      Enoch's X-ray archive contains more than nine thousand domestic vessels, of which eleven hundred show "full or partial articulation." He refuses to drink from anything he has not personally tapped with a dry walnut.
      He is currently writing the definitive field guide, "If It Chatters, Do Not Steep," which the publishers insist must not be read aloud near kitchens.`,
    quirks: ['Taps all ceramics on sight', 'Wears a spoon holster', 'Has not trusted a cup since 1987'],
    contact: 'The Consulting Shelf, above Crewe Antique Market (bring your own walnut)',
  },
  'burlap-higgins': {
    name: 'Burlap Higgins',
    role: 'Vertical Surveyor',
    desk: 'voids',
    beat: 'Refusing staircases, uninvited attics, cereal sentience',
    avatar: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80',
    joined: '1982',
    dispatches: 389,
    bio: `Burlap Higgins surveys what the Ordnance Survey quietly declines to. His instrument case contains a theodolite, a plumb line, nine ounces of breadcrumbs, and a small framed photograph of a staircase he failed to save in Solihull.
      He has measured forty-one domestic voids and mapped the interior weather of six cupboards, including the famous Halifax Pantry where it rains sideways every Bank Holiday.
      Burlap also covers cereal sentience for the paper, a double beat he describes as "the same job: things in houses becoming opinions."`,
    quirks: ['Never uses lifts', 'Measures doorways muttering', 'Owes the sea three feet of hallway'],
    contact: 'Under-space beneath Platform 4, Crewe Railway Station (mind the drip)',
  },
  'thaddeus-grist': {
    name: 'Thaddeus Grist',
    role: 'Hex Assessor',
    desk: 'hexes',
    beat: 'Property curses, air rights, fiscal witchcraft',
    avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80',
    joined: '1979',
    dispatches: 356,
    bio: `Thaddeus Grist is doubly qualified: chartered surveyor and registered hex assessor (Basin Witchcraft & Mortgage Board, grade II). He has valued eleven haunted semis, two levitating outbuildings, and one bungalow that exists only on Wednesdays.
      His columns on the Spleen Exchange are read by pigs, several of whom have written in to dispute his pork pricing.
      Thaddeus keeps his salt in a surveyor's tripod case and his surveyor's salt in a small, resentful tin.`,
    quirks: ['Throws salt before quoting', 'Has appraised a ghost (mid-range)', 'Owes a favour to a shed'],
    contact: 'Grist & Sons (no sons), Dulwich High Street — third door, the one that hums',
  },
  'lady-hiss': {
    name: 'Lady Hiss',
    role: 'Countess of Slander',
    desk: 'royals',
    beat: 'The Spite Flute (gossip), celebrity seepage, red carpets',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    joined: '1968 (the exact date is itself a rumour)',
    dispatches: 1204,
    bio: `Lady Hiss, Countess of Damp, has written THE SPITE FLUTE since before the paper moved into the cistern. Her column appears hourly; she claims to have never once met a source, only "the general dampness of public knowledge."
      Legally, the countess exists in three jurisdictions and none of them are confident. Her slander is filed under meteorology in two of them.
      She is currently, per her own column, "molting in a private clinic," and dispatches copy by carrier snail.`,
    quirks: ['Never blinks on Thursdays', 'Signs copy with a claw mark', 'Has been sued by a dry cleaners and a duchess'],
    contact: 'The Spite Flute, c/o an ungrateful otter, Beverly Hills adjacent',
  },
  'dr-vandermeer': {
    name: 'Dr. VanderMeer',
    role: 'Medical Inquisitor',
    desk: 'calcium',
    beat: 'Osteomusicology, automotive dentistry, proprietary remedies',
    avatar: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80',
    joined: '1985',
    dispatches: 277,
    bio: `Dr. VanderMeer practices without a licence, a clinic, or, several critics note, a verifiable medical degree — but with an enormous amount of conviction and a very loud harpsichord elbow of his own, which he declines to discuss.
      He interrogates patients in the old style: one lamp, one chair, one question repeated until the skeleton confesses.
      He is also the proprietor and public face of DR. VANDERMEER'S LIQUID ASBESTOS SYRUP, a commercial relationship the paper's editors have described as "fine, technically," and readers are asked to weigh accordingly.`,
    quirks: ['Prescribes in riddles', 'Owns the syrup he reviews', 'Refuses to treat anyone named Derek'],
    contact: 'The Lamp Room, address withheld for reasons of damp',
  },
  'alois-voidgauntlet': {
    name: 'Alois Void-Gauntlet',
    role: 'Roving Beast Correspondent',
    desk: 'synthetic',
    beat: 'Unlicensed fauna, lawns, entities behind mills',
    avatar: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=200&q=80',
    joined: '1994 (emerged from a hedge during a licensing audit)',
    dispatches: 233,
    bio: `Alois Void-Gauntlet was not hired so much as recorded. He emerged from a hedgerow in 1994 during a Basin Licensing Office audit, correctly identified as "unlicensed fauna operating in a press capacity," and was issued a lanyard to regularise his status.
      He roves: turf, verges, mill yards, the damp edges where creatures assemble themselves from rumour and asbestos dust.
      His dispatches are filed by hand from locations he describes only as "behind the thing you can hear."`,
    quirks: ['Photos everything through a wet cracker', 'Sleeps standing, facing hedges', 'Has been mistaken for a shed twice'],
    contact: 'Roaming. Leave messages with any sufficiently sullen lawn.',
  },
  'high-coroner': {
    name: 'The High Coroner',
    role: 'Master of Weights',
    desk: 'royals',
    beat: 'The Gazette of Absence (obituaries of the living)',
    avatar: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=200&q=80',
    joined: 'Time of appointment disputed; the ledger itself is uncertain',
    dispatches: 'Uncounted (the Gazette files itself)',
    bio: `The High Coroner keeps the Basin's register of persons currently classified as deceased for revenue purposes. The classification is administrative, reversible, and — the Coroner insists — nothing personal.
      Weights are the Coroner's second office: every spleen dispatched by this paper is weighed according to the 1922 Standard Tub Act, and it is the Coroner who calibrates the tub.
      The Coroner's face has been described by four witnesses. No two descriptions agree. One was a description of a face that had not arrived yet.`,
    quirks: ['Speaks in the past tense about the future', 'Weighs all correspondence', 'Has died twice, both times on paper'],
    contact: 'Hall of Living Graves, Crewe (visiting hours: during, never after)',
  },
};

/* -----------------------------------------------------------------------------
 * DISPATCHES (stories) — every card, ticker item and flash on the front page
 * resolves to one of these. `body` is trusted editorial HTML written by us;
 * the engine escapes all *user* input (comments, forms) before rendering.
 * -------------------------------------------------------------------------- */
export const stories = {
  'story-duchess': {
    title: 'DUCHESS ACCUSED OF HARBORING UNAPPROVED THIRD WRIST DURING ANNUAL GRAVY WEIGH-IN',
    subhead: 'Palace insists it is merely a "pocket of concentrated moisture," but forensic bakery inspectors remain entirely unconvinced.',
    desk: 'royals',
    tag: 'ROYAL EXCLUSIVE',
    tags: ['balmoral', 'wrists', 'gravy weigh-in', 'protocol', 'lard'],
    authorId: 'sister-beatrice',
    authorRole: 'Crown Mutton Attache',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    caption: 'Her Grace attempting to tuck the surplus wrist into a velvet scone-caddy while cameras flared.',
    credit: 'PHOTOGRAPHED THROUGH A WET CRACKER BY OUR AGENT',
    filed: '18 MINUTES AGO',
    published: '2025-09-30T06:40:00Z',
    cycle: '91,204',
    dateline: 'HIGH BALMORAL',
    readWeight: '14.2 OUNCES',
    readMinutes: 7,
    bulletins: [
      'LORD CHAMBERLAIN: "IT IS MERELY SURPLUS BUTTER FAT DRAWN TO DIGNITY"',
      'ARCHBISHOP PREPARES THREE CASKS OF BOILING LARD FOR THE DE-BONE RITUAL',
      'DOWNING STREET SAYS POUND STERLING HAS RECOGNIZED THE HAND AS LEGAL TENDER',
    ],
    body: `
      <p><strong>HIGH BALMORAL</strong> — The tranquil sanctity of the Sovereign Butter Balance was shattered on Monday afternoon when Her Grace, the Dowager Duchess of Ooze, stepped onto the bronze weighing platform to deliver the ceremonial greeting to the county lard.</p>
      <p>Spectators in the front ranks reported a sharp, audible click, followed by the emerging of a pale, impeccably manicured wrist from Her Grace's right velvet cuffs. The limb, described by witnesses as being "eight inches longer than permitted under the 1707 Act of Union," immediately took hold of a silver serving ladle and began attempting to feed oats to a nearby coat rack.</p>
      <p>"It moved with the confidence of an eel that knows the timetable," testified Lady Beatrice Clout, who immediately submerged her spectacles into a jar of beef extract to prevent retinal treason. Two junior equerries fainted in the approved order: tallest first.</p>
      <p>Sir Humphrey Kettle, speaking from the steps of the Royal Mews, denied all allegations of unlawful anatomy. "What the public mistook for an illicit knuckle-cluster was nothing more than an ancient damp fold in Her Grace's bombazine bodice," he explained, while sweating profusely through his epaulets. "Her Grace remains in possession of the standard allocation of two elbows and four legitimate hinges."</p>
      <p>This paper has seen the weigh-in ledger. Beside the Duchess's entry, in a hand matching none of the six attending clerks, someone has written "THIRD (SEE ALSO: 1952)" and drawn a small, confident turnip. The Palace declined to explain the turnip, the hand, or 1952.</p>
      <p>However, the League of Master Pastrymen has already issued a Level 3 Flour Sanction, ordering all households within fifteen miles of Balmoral to blindfold their dough before sundown to prevent moral contamination. The sanction takes effect at the next low tide of lard.</p>
      <p>Her Grace herself has not commented. She has, however, been seen purchasing a third glove — left-handed — from a travelling haberdasher of no fixed parish. We continue our vigil.</p>
    `,
    updates: [
      { time: '07:12', text: 'Flour Sanction raised to Level 3. Dough within fifteen miles must be blindfolded before sundown.' },
      { time: '06:55', text: 'Downing Street confirms the third wrist is now recognized as legal tender in small denominations.' },
      { time: '06:40', text: 'First dispatch filed from the weigh-in platform.' },
    ],
    related: ['story-kneecaps', 'story-carpet', 'special-dispensation'],
    comments: [
      { author: 'Alderman Girth', badge: 'Current State: Sullen', text: 'I saw the third glove twitching at Michaelmas. It was trying to sign a receipt for seventy pounds of lard.', when: '2 CYCLES AGO' },
      { author: 'Ethel from Shropshire', badge: 'Current State: Extremely Moist', text: 'My own mother had a surplus wrist in 1952. We simply kept it in a wicker biscuit tin until the coronation had passed.', when: '5 CYCLES AGO' },
    ],
  },

  'story-gravy': {
    title: "NORTH RIDING FAMILY ADMITS: 'OUR SUNDAY GRAVY HAS COMMITTED THREE SEPARATE PETTY BURGLARIES'",
    subhead: "Forensic swabs taken from the bread bin align with thickened cornstarch found outside the jeweler's safe.",
    desk: 'domestic',
    tag: 'CULINARY TERROR',
    tags: ['gravy', 'burglary', 'skipton', 'cornstarch', 'custodial sauce'],
    authorId: 'archie-clack',
    authorRole: 'Condiment Detective',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    caption: 'The gravy boat in custody at Skipton Police Station. It refused to state its viscosity.',
    credit: 'EVIDENCE #89 — BASIN FORENSIC KITCHEN',
    filed: '2 HOURS AGO',
    published: '2025-09-30T04:20:00Z',
    cycle: '91,204',
    dateline: 'SKIPTON',
    readWeight: '9.8 OUNCES',
    readMinutes: 5,
    body: `
      <p><strong>SKIPTON</strong> — A quiet family dinner in the West Riding turned into a full police cordon this weekend after the Hargreaves family confessed that their Bisto reduction had developed both ambition and stealth.</p>
      <p>"At first it was just small things," wept Mrs. Maureen Hargreaves, 58. "A teaspoon missing from the sideboard. A sixpence gone from the mantelpiece. Then on Friday night, we heard a wet, slurping sound coming from the skylight."</p>
      <p>Police Chief Inspector Vole confirmed that the gravy boat had escaped through the coal chute at approximately 2:15 AM and was discovered forty minutes later attempting to crack the display case of a pawn shop using a small, hardened piece of Yorkshire pudding as a lever.</p>
      <p>This is the third offence. In July the same sauce was cautioned for loitering with intent to thicken outside a butcher's in Settle. In August it entered a chip shop and left without buying anything, an act the magistrate described as "insolent in a manner the law cannot yet name."</p>
      <p>Forensic swabs taken from the family bread bin align perfectly with the puddle of thickened cornstarch found outside the jeweler's safe. The pudding lever, meanwhile, has been remanded to a cool oven pending trial; defence counsel is expected to argue it was merely a crouton of convenience.</p>
      <p>The gravy itself remains in a non-stick saucepan without bail. Inspectors report it has begun organizing the other condiments. The mustard has already asked for a solicitor and, oddly, for a small hat.</p>
    `,
    updates: [
      { time: '05:40', text: 'Mustard in adjacent cell requests solicitor and a small hat. Request under review.' },
      { time: '04:20', text: 'Gravy remanded in non-stick saucepan without bail.' },
    ],
    related: ['story-lentils', 'story-tuesday', 'story-duchess'],
    comments: [
      { author: 'Constable P. Prickett', badge: 'Current State: Replaced by Salt', text: 'The sauce has been remanded in a non-stick saucepan without bail.', when: '1 CYCLE AGO' },
      { author: 'Mrs. M. Hargreaves', badge: 'Current State: Extremely Moist', text: 'We still set a place for it. My husband says never. I say it was only ever hungry for silver.', when: '4 HOURS AGO' },
    ],
  },

  'story-lint': {
    title: 'HOW TO RECOGNIZE IF YOUR NAVEL LINT IS DRAFTING LEGISLATION',
    subhead: 'If the residue is blue, it favors public transportation subsidies. If grey, it intends to outlaw Tuesdays altogether.',
    desk: 'domestic',
    tag: 'HYGIENE AGITATION',
    tags: ['lint', 'legislation', 'ministry of wool', 'tuesdays'],
    authorId: 'gwendolyn-spittle',
    authorRole: 'Senior Fluff Academic',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    caption: 'Specimen #40-C seen under a magnifying brass monocle. Note the tiny signature.',
    credit: 'MINISTRY OF WOOL, PLATE 40-C',
    filed: '3 HOURS AGO',
    published: '2025-09-30T03:05:00Z',
    cycle: '91,204',
    dateline: 'LEEDS',
    readWeight: '4.1 OUNCES',
    readMinutes: 4,
    body: `
      <p><strong>LEEDS</strong> — Medical officials from the Ministry of Wool gathered today to issue an urgent warning regarding abdominal lint buildup. It appears that three out of five urban deposits have formed miniature parliamentary subcommittees.</p>
      <p>The colour of the residue, officials stress, is everything. Blue fluff governs by coalition and favours public transportation subsidies, night buses, and the polite lighting of stairwells. Grey fluff sits on the back benches of your waistband and intends to outlaw Tuesdays altogether — a position it shares with the Ministry of Calendar Alignment (see separate dispatch).</p>
      <p>"Do not bathe aggressively," warns Dr. Oglethorpe, chair of the emergency fluff session. "If you disturb them while they are debating the 2026 Woolen Tariff, they may vote to annex your lower ribs into the municipality of Doncaster."</p>
      <p>Recognising legislation in progress is simple. If the lint arranges itself into columns, it is drafting. If it forms a tiny signature at the foot of the columns, it has passed second reading. If your navel begins knocking like a door with a warrant, it is Royal Assent, and you must comply or emigrate.</p>
      <p>The Ministry has opened a register of affected abdomens at its Leeds evening college. Applicants should bring a specimen in a labelled pillbox and, per the notice by the door, "an open mind and a closed midriff."</p>
      <p>One attendee, who asked to be identified only as Lord Burlap, told this paper his own deposit had passed a bill declaring his trousers unconstitutional. He is currently governing from the waist up.</p>
    `,
    updates: [
      { time: '03:40', text: 'Ministry confirms: pillbox specimens accepted until the fluff forms its own queue.' },
    ],
    related: ['story-tuesday', 'story-bone', 'story-receipt'],
    comments: [
      { author: 'Lord Burlap', badge: 'Current State: Sullen', text: 'Mine just passed a bill declaring my trousers unconstitutional.', when: '2 CYCLES AGO' },
    ],
  },

  'story-bone': {
    title: 'IS YOUR TEAPOT HARBORING ITS OWN SKELETON? 9 WARNING SOUNDS TO LISTEN FOR AT DUSK',
    subhead: "Miniature clavicles found beneath the glaze of popular ceramic sets. 'It purrs when the Earl Grey is poured.'",
    desk: 'calcium',
    tag: 'CALCIUM CRISIS',
    tags: ['teapots', 'skeletons', 'crewe', 'wedgwood', 'dusk'],
    authorId: 'enoch-boneweaver',
    authorRole: 'Ceramic Osteopath',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    caption: 'X-ray of a 1920s porcelain pot revealing an articulated spinal column around the handle.',
    credit: 'BONE-WEAVER ARCHIVE, PLATE XI',
    filed: '22 MINUTES AGO',
    published: '2025-09-30T06:36:00Z',
    cycle: '91,204',
    dateline: 'CREWE',
    readWeight: '11.3 OUNCES',
    readMinutes: 6,
    body: `
      <p><strong>CREWE</strong> — Households throughout Crewe and Northwich are advised to tap their teapots sharply with a dry walnut. If the vessel responds with a hollow, toothy clatter rather than a sharp ceramic chime, it is likely that your vessel has undergone spontaneous skeletal maturation.</p>
      <p>The Calcium Desk has confirmed the presence of miniature clavicles forming beneath the glaze of at least forty Wedgwood sets this quarter. "It purrs when the Earl Grey is poured," claims Mrs. Agatha Pith, 72, whose pot now answers to the name of Geoffrey.</p>
      <p>Nine warning sounds to listen for at dusk, compiled with the Basin Osteological Society:</p>
      <ul>
        <li><strong>1. The wet click</strong> — as of a small joint accepting a small responsibility.</li>
        <li><strong>2. The teeth-chatter</strong> — faint, rhythmic, synchronised with the kitchen clock.</li>
        <li><strong>3. The purr</strong> — only ever when Earl Grey is poured; never with builders' tea (the skeleton considers it beneath them).</li>
        <li><strong>4. The knuckle-drum</strong> — lids tapping Morse from the inside. So far decoded: "MORE LEAF."</li>
        <li><strong>5. The stair-creak</strong> — the pot ascending to a warmer shelf without assistance.</li>
        <li><strong>6. The hymn</strong> — William IV-era, always slightly flat, always at teatime.</li>
        <li><strong>7. The sniff</strong> — a dry ceramic inhalation when biscuits are opened nearby.</li>
        <li><strong>8. The sigh of steam</strong> — shaped, if you listen, like the word "grandmother."</li>
        <li><strong>9. The silence</strong> — worst of all. A matured pot that has stopped performing its rattles is a pot that has started planning.</li>
      </ul>
      <p><strong>HOTLINE VERDICT:</strong> Smash the spout with a wooden paddle. Do not use iron, or the bones will knit into an aggressive wren. The wren will then require its own teapot, and the cycle — as the Society's registrar put it — "becomes ornithological."</p>
      <p>Readers who suspect full articulation should not confront the pot directly. Leave a saucer of warm milk and a small apology on the draining board, withdraw slowly, and telephone the desk. We will bring the walnut.</p>
    `,
    updates: [
      { time: '07:02', text: 'Osteological Society raises Greater Crewe alert to AMBER: two full articulations confirmed since Friday.' },
      { time: '06:36', text: 'Hotline verdict appended: wooden paddle only. No iron. Do not let it become a wren.' },
    ],
    related: ['story-elbow', 'story-lint', 'story-teeth'],
    comments: [
      { author: 'Rev. C. Daintry', badge: 'Current State: In High Balmoral', text: 'We tried to bury ours in church ground, but it dug itself back up by tea time.', when: '1 CYCLE AGO' },
      { author: 'Agatha Pith', badge: 'Current State: Extremely Moist', text: 'Geoffrey has started taking sugar tongs to bed. I do not have the heart to stop him.', when: '6 HOURS AGO' },
    ],
  },

  'story-stairs': {
    title: "SUBURBAN FLIGHT OF STAIRS REFUSES TO LEAD DOWNWARDS: 'EVERY STEP MERELY BRINGS US CLOSER TO MR. HENDERSON'S MOUSTACHE'",
    subhead: 'Solihull family of six subsists on ceiling paper and moisture from the water cylinder.',
    desk: 'voids',
    tag: 'DOMESTIC VOID',
    tags: ['stairs', 'solihull', 'attics', 'mr henderson', 'plaster diet'],
    authorId: 'burlap-higgins',
    authorRole: 'Vertical Surveyor',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    caption: 'The staircase in question, seen here attempting to achieve higher orbit above the hallway rug.',
    credit: 'SURVEY PLATE 14 — DAYS TRAPPED AT ALTITUDE',
    filed: '6 HOURS AGO',
    published: '2025-09-30T00:15:00Z',
    cycle: '91,204',
    dateline: 'SOLIHULL',
    readWeight: '12.6 OUNCES',
    readMinutes: 6,
    body: `
      <p><strong>SOLIHULL</strong> — The Miller family has spent the last fortnight stranded on their second-floor landing after their carpeted staircase reversed its polarity and declared ground level "philosophically untenable."</p>
      <p>"Whenever I attempt to take a step downward toward the kitchen, I find myself ascending into an attic that wasn't there when we purchased the semi-detached," says Graham Miller, 46. "Worse still, the wallpaper has begun humming hymns from the reign of William IV."</p>
      <p>The attic, the family confirms, belongs to a Mr. Henderson — or leads to one. His moustache is visible at the far end of every attempted descent, growing fractionally nearer with each step. Mr. Henderson has not spoken. He has, the children report, "been trimming it for fourteen days."</p>
      <p>Fire crews attempted to erect a wooden ladder through the bathroom window, but the ladder immediately took root in the lawn and began producing sour plums. The plums have been tasted by one (1) brave neighbour, who described them as "legally complicated."</p>
      <p>The family of six now subsists on ceiling plaster, damp envelope glue, and the condensation of the water cylinder, which the Voids Desk has measured at a surprisingly nutritious 4.2 on the Higgins Domestic Sustenance Scale. Youngest daughter Ellen, 9, has started a small school on the landing. Its motto: "Down Is A Rumour."</p>
      <p>Council surveyors arrived Tuesday, ascended the stairs normally, and have not been seen since. Their theodolite was returned through the letterbox on Thursday, alone, with a note: "DO NOT MEASURE THE MOUSTACHE."</p>
    `,
    updates: [
      { time: '09:30', text: 'Sour plums from the rooted ladder enter evidence. One neighbour tasting confirmed, condition sullen.' },
      { time: '00:15', text: 'Fourteen days at altitude. Council theodolite returned by post, unaccompanied.' },
    ],
    related: ['story-tuesday', 'story-shed', 'story-lawns'],
    comments: [
      { author: 'Vera Preece', badge: 'Current State: Extremely Moist', text: "Have they tried coating the risers in salted dripping? That cured my uncle's cellar in 1961.", when: '3 CYCLES AGO' },
      { author: 'Ellen Miller (age 9)', badge: 'Current State: At Altitude', text: 'Our school has 6 pupils and 1 moustache. We do arithmetic with the steps. The answers keep going up.', when: '2 HOURS AGO' },
    ],
  },

  'story-shed': {
    title: 'GARDEN SHED IN DULWICH LEVITATES 4 INCHES EVERY WEDNESDAY',
    subhead: 'Council demands back payment for three decades of unapproved airspace occupancy.',
    desk: 'hexes',
    tag: 'HEX & MORTGAGE',
    tags: ['sheds', 'dulwich', 'levitation', 'air rights', 'council tax'],
    authorId: 'thaddeus-grist',
    authorRole: 'Hex Assessor',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    caption: 'The levitating shed hover-drifting three inches above the lawn mower.',
    credit: 'GRIST & SONS SURVEY, WEDNESDAY 09:15',
    filed: 'YESTERDAY',
    published: '2025-09-29T09:20:00Z',
    cycle: '91,203',
    dateline: 'DULWICH',
    readWeight: '7.4 OUNCES',
    readMinutes: 4,
    body: `
      <p><strong>DULWICH</strong> — A potting shed belonging to retired railway clerk Arthur Finch has begun a weekly ascent, rising four inches at precisely 9:15 AM every Wednesday and bobbing gently until dusk.</p>
      <p>Council inspectors have delivered three separate summonses, citing "unlawful aerostatic garden furniture" and demanding back payment for three decades of unapproved airspace occupancy. The assessment stands at four inches per Wednesday, compounded, plus interest at the prevailing hex rate.</p>
      <p>Mr. Finch maintains he only keeps three rakes and a bag of bone meal inside, though neighbours report seeing a pale hand reach out from the padlock hatch to check the barometer. The hand waves. The barometer, taken Tuesday evening, read "HEAVY, WITH A CHANCE OF ALTITUDE."</p>
      <p>As a registered hex assessor I inspected the foundations on Wednesday at ascent plus one inch. The concrete footing is intact, the soil undisturbed, and the shadow beneath the shed — this is the detail the council report omits — approximately nine inches too large.</p>
      <p>My verdict: this is not levitation in the fashionable sense. Something is holding the shed at arm's length, and that something is crouched in the space where the shadow over-performs. Homeowners in SE21 should check their outbuildings Wednesdays at 9:15. If your shed rises, do not look underneath. Salt the hinges. Pay the council. We are negotiating a settlement in rakes.</p>
    `,
    updates: [
      { time: '16:45', text: 'Settlement talks opened: council may accept payment in rakes (three, matching).' },
    ],
    related: ['story-thursday', 'story-stairs', 'story-lawns'],
    comments: [
      { author: 'Arthur Finch', badge: 'Current State: Sullen', text: 'I just want to get my trowel back without needing a stepladder.', when: '1 CYCLE AGO' },
      { author: 'Cllr. D. Mutton', badge: 'Current State: Replaced by Salt', text: 'The airspace is the airspace. Four inches is four inches. The rakes must match.', when: '20 HOURS AGO' },
    ],
  },

  'story-oats': {
    title: "COMMUNITY OATS RECOGNIZE THE MAYOR: 'THEY TURNED SULLEN AND SALTY AS HE ENTERED THE PARISH HALL'",
    subhead: 'Porridge vat in Lancashire enters collective refusal to boil.',
    desk: 'synthetic',
    tag: 'OAT ANARCHY',
    tags: ['oats', 'porridge', 'lancashire', 'the mayor', 'exclusion zone'],
    authorId: 'burlap-higgins',
    authorRole: 'Cereal Reporter',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    caption: 'The breakfast vat refusing heat at 200 degrees Celsius.',
    credit: 'PARISH COMMITTEE EVIDENCE, VAT 2',
    filed: '4 HOURS AGO',
    published: '2025-09-30T02:10:00Z',
    cycle: '91,204',
    dateline: 'LANCASTER',
    readWeight: '6.9 OUNCES',
    readMinutes: 4,
    body: `
      <p><strong>LANCASTER</strong> — Over four hundred bowls of Scottish rolled oats curdled into the likeness of former Prime Minister Arthur Balfour yesterday morning, an event the Parish Committee has classified as "recognizance, hostile."</p>
      <p>The oats, staged in a communal vat for the annual Charity Breakfast, turned sullen and salty as the Mayor entered the parish hall at 7:40 AM. Witnesses say the entire surface of the vat inclined toward him, the way a congregation turns toward a late arrival it disapproves of.</p>
      <p>"They knew him," said Cook Mary, who has prepared the charity breakfast for thirty-one years and resigned on the spot. "Not the Mayor himself — they knew his middle name. A spoonful of them arranged into a crude anagram of it. I read it. I will not repeat it. I have thrown the whole cauldron into the canal."</p>
      <p>The cauldron, for its part, refused to boil at any temperature up to 200 degrees Celsius. The fire brigade's thermal lance produced only a low, patient hissing that two attendants independently transcribed as "we have already eaten."</p>
      <p>The Parish Committee has declared the kitchen an exclusion zone until the steam stops speaking French. As of filing, the steam has negotiated twice, requested a delegate, and been refused. The canal, meanwhile, has begun to smell faintly of Balfour.</p>
      <p>The Mayor declined to comment on his middle name, the anagram, or the oats' apparent familiarity with his family. He has, however, cancelled all breakfast engagements "for the duration of the term and one term thereafter."</p>
    `,
    updates: [
      { time: '08:00', text: 'Canal water testing positive for porridge at three locks downstream.' },
    ],
    related: ['story-lentils', 'story-lawns', 'story-gravy'],
    comments: [
      { author: 'Cook Mary', badge: 'Current State: Replaced by Salt', text: 'A spoonful bit my apron. We threw the whole cauldron into the canal.', when: '2 CYCLES AGO' },
    ],
  },

  'story-tuesday': {
    title: "MINISTRY WARNS: 'DO NOT REPEAT TUESDAY IN THE PRESENCE OF BREAD'",
    subhead: 'Chronology disputes spread throughout the Basin bakery district.',
    desk: 'voids',
    tag: 'CALAMITY NOTICE',
    tags: ['tuesdays', 'bread', 'calendar alignment', 'yeast', 'ancestral flour'],
    authorId: 'sister-beatrice',
    authorRole: 'Vapour Clerk',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    caption: 'A loaf of bloomer bread retreating into its dough envelope.',
    credit: 'MINISTRY OF CALENDAR ALIGNMENT',
    filed: '8 HOURS AGO',
    published: '2025-09-29T22:30:00Z',
    cycle: '91,203',
    dateline: 'THE BASIN BAKERY DISTRICT',
    readWeight: '5.5 OUNCES',
    readMinutes: 4,
    body: `
      <p><strong>THE BASIN</strong> — The Ministry of Calendar Alignment has urged all citizens to refer to the second day of the working week simply as "The Damp Interval" when within five yards of yeast, proving pans, or any person who has recently eaten either.</p>
      <p>The warning follows eleven confirmed chronology disputes in the bakery district this month alone. In the gravest incident, a shopkeeper on Loom Street repeated the word "Tuesday" while slicing a bloomer. The loaf contracted, witnesses say, "into dense raw wheat berries out of sheer disgust," and the shop's calendar lost the entire month of March 1987.</p>
      <p>Failure to comply, the Ministry notes, may cause flour to remember its ancestors in the Carboniferous period. Ancestral flour does not bake. It sediments. Two bakeries on Loom Street are now geologically classified and have been issued trowels in place of peels.</p>
      <p>"The week is load-bearing," reads the Ministry notice, posted in every bakery window. "Do not lean on Tuesday. Do not repeat it. Do not, under any circumstances, say it twice to sourdough — sourdough keeps its own calendar, and it is older than yours, and it is smug."</p>
      <p>Grey navel lint, currently drafting legislation in abdomens across Leeds (see separate dispatch), has announced its support for the ban. Lint and yeast have not shared a constituency since 1904; observers describe the alliance as "damp but determined."</p>
      <p>The Damp Interval takes effect immediately and continues, per the Ministry, "until further weekday."</p>
    `,
    updates: [
      { time: '23:05', text: 'Two Loom Street bakeries reclassified as sedimentary. Trowels issued.' },
    ],
    related: ['story-lint', 'story-stairs', 'story-receipt'],
    comments: [
      { author: 'Baker of Loom St.', badge: 'Current State: Carboniferous', text: 'I said it twice. It was only a word. Now my proven drawer has trilobites in it and the insurance says Acts of Weekday are excluded.', when: '5 HOURS AGO' },
    ],
  },

  'story-carpet': {
    title: 'OSCARS CARPET SUSPECTED OF BEING 90% CONGEALED RASPBERRY JELLY AND SEVENTEEN FORGOTTEN CUFFLINKS',
    subhead: 'Stars sank up to their shins while smiling desperately for paparazzi flash.',
    desk: 'royals',
    tag: 'CELEBRITY SEEPAGE',
    tags: ['hollywood', 'red carpet', 'jelly', 'cufflinks', 'awards season'],
    authorId: 'lady-hiss',
    authorRole: 'Countess of Slander',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    caption: 'An A-list star slowly sinking into the crimson mire outside the theatre.',
    credit: 'SHOT THROUGH A WET CRACKER — SPITE FLUTE BUREAU',
    filed: 'SUNDAY',
    published: '2025-09-28T21:00:00Z',
    cycle: '91,202',
    dateline: 'HOLLYWOOD',
    readWeight: '8.2 OUNCES',
    readMinutes: 4,
    body: `
      <p><strong>HOLLYWOOD</strong> — The ceremonial walkway began digesting the footwear of multiple nominees on Sunday, in what the theatre's own laboratory now concedes was "never carpet in any recognized sense."</p>
      <p>Assay results, leaked to this column by a junior upholsterer of impeccable dampness, place the composition at 90% congealed raspberry jelly, 6% industrial sealant, 3% press-agent hope, and seventeen (17) forgotten cufflinks, at least four of them engraved.</p>
      <p>Celebrities whose heels sank deeper than three inches were, per house protocol dating to 1974, classified as permanent fixtures of the Kodak lobby. Three such fixtures were extricated with wooden trowels before the ceremony; a fourth remains, by all accounts, "very well positioned for the bar."</p>
      <p>Publicists issued a joint statement describing the evening as "texturally ambitious." One manager, speaking on condition of anonymity and slight stickiness, confirmed that his client's acceptance speech was delivered from the ankles down: "She gave the statuette to the carpet. The carpet, in fairness, gave her a cufflink back. We are calling it a trade."</p>
      <p>The theatre has declined to say where the carpet was sourced, though the jelly bears the watermarks of a celebrated Sussex preserve works that closed in 1968 — the very year, readers of a certain age will note, this paper was founded in an abandoned cistern. We are looking into the coincidence with our usual calm.</p>
      <p>Next year's ceremony will reportedly use gravel. The cufflinks have been invited back.</p>
    `,
    updates: [
      { time: '22:15', text: 'Fourth fixture confirmed comfortable near the bar. Cufflink exchange rate holding.' },
    ],
    related: ['story-wafers', 'story-duchess', 'story-elbow'],
    comments: [
      { author: 'Junior Upholsterer (name withheld)', badge: 'Current State: Sticky', text: 'I counted the cufflinks twice. Seventeen. One was mine. I want it back.', when: '1 CYCLE AGO' },
    ],
  },

  'story-elbow': {
    title: "MAN SUFFERS FROM SPONTANEOUS ELBOW HARPSICHORD: 'I CANNOT BEND MY ARM WITHOUT COMMENCING SCARLATTI'",
    subhead: 'Every flexion of the ulnar nerve produces delicate 18th-century counterpoint.',
    desk: 'calcium',
    tag: 'OSTEOMUSICAL MIRACLE',
    tags: ['elbows', 'harpsichord', 'scarlatti', 'bach', 'rail replacement'],
    authorId: 'dr-vandermeer',
    authorRole: 'Medical Inquisitor',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    caption: 'Clinical diagram showing plucked bone plectrums inside the elbow cavity.',
    credit: 'THE LAMP ROOM, PLATE 9',
    filed: 'TUESDAY',
    published: '2025-09-29T11:00:00Z',
    cycle: '91,203',
    dateline: 'THE LAMP ROOM',
    readWeight: '6.1 OUNCES',
    readMinutes: 4,
    body: `
      <p><strong>THE LAMP ROOM</strong> — Mr. Derek Pouch, 44, of no fixed address (the addresses keep applauding), has been forbidden from boarding passenger trains after his left arm began an unprompted performance of Bach's Well-Tempered Clavier during peak commuter hours.</p>
      <p>The condition — spontaneous elbow harpsichord, clinically "osteomusical maturity" — develops when the olecranon secretes miniature plectra and the ulnar nerve strings itself. Every flexion produces delicate 18th-century counterpoint. Every extension resolves it. Mr. Pouch can no longer reach a top shelf without a cadenza.</p>
      <p>"I went to hang a coat," he testified, arm at a cautious half-bend. "By the time the coat was up, I had commenced Scarlatti. The hallway has begun charging admission."</p>
      <p>Surgeons at the Basin Infirmary have refused to operate until the sonata in G-minor has reached its customary coda — a matter, they estimate, of eleven to fourteen years, "assuming the elbow keeps to tempo and does not take requests."</p>
      <p>I have examined the joint under my single lamp. The plectra are ivory-white, perfectly formed, and faintly warm. They hum when spoken to in low Latin — a diagnostic trait this paper has seen before, in the teapots of Greater Crewe (see separate dispatch). Whether the elbow and the teapots share a maker, I decline to speculate. I have, however, declined to treat anyone named Derek since, and today I begin to understand why the rule existed.</p>
      <p>Mr. Pouch has been fitted with a conductor's baton and a small sign reading "PLEASE NO ENCORES." Rail staff report the sign is not working.</p>
    `,
    updates: [],
    related: ['story-bone', 'story-lint', 'story-teeth'],
    comments: [
      { author: 'Derek P.', badge: 'Current State: In G-Minor', text: 'The sign is not working. A woman requested Für Elise yesterday. My arm obliged. It was not Beethoven. It was worse. It was polite.', when: '1 CYCLE AGO' },
    ],
  },

  'special-dispensation': {
    title: 'OBITUARIES (LIVING): PERSONS CURRENTLY CLASSIFIED AS DECEASED FOR REVENUE PURPOSES',
    subhead: 'Please review the list below to ensure your lungs have not been scheduled for reclamation.',
    desk: 'royals',
    tag: 'GAZETTE OF ABSENCE',
    tags: ['obituaries', 'revenue', 'shadows', 'habeas corpus', 'the register'],
    authorId: 'high-coroner',
    authorRole: 'Master of Weights',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    caption: 'The Hall of Living Graves at Crewe. All beds occupied by functional citizens.',
    credit: 'CORONIAL PLATE — DO NOT REPRODUCE AFTER SUNSET',
    filed: 'HOURLY',
    published: '2025-09-30T07:00:00Z',
    cycle: '91,204',
    dateline: 'HALL OF LIVING GRAVES, CREWE',
    readWeight: '3.3 OUNCES (ADMINISTRATIVE)',
    readMinutes: 3,
    body: `
      <p><strong>CREWE</strong> — The following individuals are hereby notified that their shadows are no longer protected under the 1934 Habeas Corpus Act. Classification is administrative, reversible, and — the Register insists — nothing personal.</p>
      <ul>
        <li><strong>Mr. Cyril Clout</strong> — Seen walking briskly while clearly lacking an internal dialogue. Shadow last observed queuing separately for a bus it did not board.</li>
        <li><strong>Mrs. Beatrice Ooze</strong> — Deceased since Tuesday lunch, though still maintaining an allotment in Halifax. The allotment, inspectors note, is in better condition than most living persons'.</li>
        <li><strong>The Bishop of Bath and Wells</strong> — Disintegrated into coarse salt; continues to vote by postal proxy. The salt has been asked to reconstitute and has requested "until after Easter, at the earliest, and not the fake one."</li>
        <li><strong>Mr. H. Finch (shed owner)</strong> — Classified pending airspace settlement. Reclassification expected upon payment in matching rakes (three).</li>
        <li><strong>Anonymous (middle name withheld)</strong> — Classification requested by oats. Under review. The oats have been asked to submit their claim in writing; they have instead submitted a crude anagram.</li>
      </ul>
      <p>If your name appears above and your lungs are functioning, you are invited to attend the Hall of Living Graves during visiting hours (during, never after) to weigh your objection. All objections are weighed literally, in accordance with the 1922 Standard Tub Act.</p>
      <p>If your name does not appear above and you feel that it should, the Register apologises for the oversight and has opened a waiting list. The waiting list is also, technically, deceased. Please join it in person.</p>
      <p>This Gazette files itself hourly. It has never missed an edition. It has, on four occasions, filed editions that had not happened yet; two of those editions have since occurred, one is overdue, and the fourth is the subject of an ongoing internal enquiry the Register declines to confirm, deny, or survive.</p>
    `,
    updates: [],
    related: ['story-duchess', 'story-shed', 'story-oats'],
    comments: [
      { author: 'Cyril Clout', badge: 'Current State: Brisk', text: 'My shadow queued for the 42 and did not board. That is not death. That is good sense.', when: 'HOURLY' },
      { author: 'The Coarse Salt (formerly Bishop)', badge: 'Current State: Granular', text: 'Reconstitution after Easter. Not the fake one. The Register knows which.', when: 'HOURLY' },
    ],
  },
};

/* --- NEW DISPATCHES: every ticker line, the breaking flash and the mandate
       strip now resolve to a full story instead of scrolling past ---------- */

  Object.assign(stories, {
  'story-wafers': {
    title: 'ACTOR TIMOTHÉE CHALAMET REPORTEDLY SEPARATES INTO 16,000 WARM COMMUNION WAFERS DURING RED CARPET INTERVIEW',
    subhead: 'Publicists describe the event as "texturally ambitious but contractually fine"; each wafer answered questions independently.',
    desk: 'royals',
    tag: 'CELEBRITY SEEPAGE',
    tags: ['hollywood', 'red carpet', 'wafers', 'separation event', 'awards season'],
    authorId: 'lady-hiss',
    authorRole: 'Countess of Slander',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    caption: 'The moment of separation, caught between two camera flashes. Note the orderly queue forming.',
    credit: 'SPITE FLUTE BUREAU — DEVELOPED IN BROTH',
    filed: '1 HOUR AGO',
    published: '2025-09-30T05:50:00Z',
    cycle: '91,204',
    dateline: 'HOLLYWOOD',
    readWeight: '0.4 OUNCES (EACH)',
    readMinutes: 4,
    body: `
      <p><strong>HOLLYWOOD</strong> — Midway through a red-carpet interview concerning his preparation for a role he has not yet been offered, the actor reportedly paused, apologised in advance ("this is a first"), and separated calmly into 16,000 warm communion wafers.</p>
      <p>The separation was not violent. Eyewitnesses describe a folding, like a very large napkin deciding it had been used. One moment a leading man; the next, a low altar-like hum and a great deal of tasteful catering geometry.</p>
      <p>Each wafer, this column can confirm, answered press questions independently and entirely in character. Wafer #4,212 gave the night's best answer about craft: "I contain multitudes. Literally. I am a multitude." Wafer #11 refused to discuss the director. Wafers #8,900 through #8,940 have formed a small, extremely polite union and are seeking a bread basket with a view.</p>
      <p>The studio's insurers classified the event as "a separation, not a loss," noting that the actor's total surface area has increased while his obligations remain singular. His publicist was seen attempting to gather the talent into a hat. The talent declined: several wafers had already accepted invitations to three separate after-parties, a christening, and a light lunch in Pasadena.</p>
      <p>Reunification is scheduled for after awards season "or when the queue dies down," whichever the wafers collectively prefer. They vote by crumb. Early counts suggest the christening is winning.</p>
      <p>The carpet itself — already under investigation for jelly content (see separate dispatch) — absorbed approximately two hundred wafers and has begun answering questions on their behalf. Its answers are stickier but, critics concede, more candid.</p>
    `,
    updates: [
      { time: '06:30', text: 'Wafer union (#8,900–#8,940) granted bread basket with a view. Morale: warm.' },
    ],
    related: ['story-carpet', 'story-kneecaps', 'story-duchess'],
    comments: [
      { author: 'Wafer #4,212', badge: 'Current State: A Multitude', text: 'For the record I gave the better answer and I will be reassembling LAST.', when: '40 MINUTES AGO' },
      { author: 'Hat (publicist-owned)', badge: 'Current State: Overwhelmed', text: 'I have contained six hundred and eleven. I cannot contain six hundred and twelve. Please advise.', when: '55 MINUTES AGO' },
    ],
  },

  'story-kneecaps': {
    title: "PALACE SPOKESMAN CONFIRMS: THE KING'S KNEECAPS ARE ONCE AGAIN ACCUMULATING MIGRATORY CRICKETS",
    subhead: 'Third episode since the coronation. Court entomologist describes the insects as "seasonal, constitutional, and extremely well-travelled."',
    desk: 'royals',
    tag: 'PALACE WATCH',
    tags: ['palace', 'crickets', 'kneecaps', 'migration', 'protocol'],
    authorId: 'sister-beatrice',
    authorRole: 'Palace Damp Liaison',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    caption: 'The court entomologist inspecting the left kneecap at a respectful constitutional distance.',
    credit: 'PALACE DAMP LIAISON OFFICE',
    filed: '5 HOURS AGO',
    published: '2025-09-30T01:45:00Z',
    cycle: '91,204',
    dateline: 'THE PALACE',
    readWeight: '5.9 OUNCES',
    readMinutes: 4,
    body: `
      <p><strong>THE PALACE</strong> — A palace spokesman has confirmed, in the passive voice reserved for joint royal matters, that "the knees are again experiencing arrivals." It is the third such episode since the coronation, and the crickets, the court entomologist stresses, are not residents. They are migrants. The kneecaps are a stopover.</p>
      <p>The insects arrive each autumn from the Continent, having crossed the Channel in the folds of diplomatic correspondence. They rest, they chirp — always in the key of the national anthem, always slightly flat — and within a fortnight they depart for the wainscoting of a warmer palace further south.</p>
      <p>"Seasonal, constitutional, and extremely well-travelled," the entomologist told this paper, declining to elaborate on how the crickets obtain their papers. One, examined in 2023, carried a tiny visa stamped by a legation that does not exist and, the entomologist admitted, "has not existed for some time, and possibly never has."</p>
      <p>Courtiers report that investitures held during a stopover are unusually dignified: the chirping, though flat, keeps excellent time, and two knights have been dubbed to it without incident. The King, per the spokesman, "regards the arrivals as guests and has asked that the left knee be left unoccupied for the wintering pair."</p>
      <p>The Department of Damp has been asked to monitor humidity in the royal corridors, since damp — as this desk has long maintained — is the medium in which all constitutional oddities travel. Our hygrometers are installed behind the third radiator. They are already, faintly, chirping along.</p>
    `,
    updates: [
      { time: '06:10', text: 'Chirping confirmed in key of anthem, three semitones flat. Investitures proceeding.' },
    ],
    related: ['story-duchess', 'story-wafers', 'special-dispensation'],
    comments: [
      { author: 'Court Entomologist', badge: 'Current State: Professional', text: 'They have papers. I have seen one paper. I do not intend to see a second, for reasons of state.', when: '2 CYCLES AGO' },
    ],
  },

  'story-thursday': {
    title: 'FEDERAL RESERVE CUTS WEIGHT OF THURSDAY AFTERNOON FROM 16oz DOWN TO A LIMP 4oz',
    subhead: 'Markets stable; calendars sagging. The Spleen Exchange suspends trading in all weekday futures until the limp resolves.',
    desk: 'hexes',
    tag: 'FISCAL WEATHER',
    tags: ['federal reserve', 'thursdays', 'weekdays', 'futures', 'spleen exchange'],
    authorId: 'thaddeus-grist',
    authorRole: 'Fiscal Hex Correspondent',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    caption: 'Traders on the Exchange floor watching Thursday afternoon being carried out on a stretcher of ledgers.',
    credit: 'SPLEEN EXCHANGE FLOOR, 14:00 SHARP',
    filed: 'YESTERDAY',
    published: '2025-09-29T14:00:00Z',
    cycle: '91,203',
    dateline: 'THE SPLEEN EXCHANGE',
    readWeight: '4.0 OUNCES (EXACTLY)',
    readMinutes: 4,
    body: `
      <p><strong>THE SPLEEN EXCHANGE</strong> — In an emergency session convened between two tides of lard, the monetary authorities have cut the weight of Thursday afternoon from a robust 16 ounces to a limp and unsatisfying 4. The measure takes effect this week and, the notice confirms, "retroactively where Thursdays permit."</p>
      <p>The cut was described as prudent. Thursday afternoons had grown heavy — too heavy to carry into Friday, heavy enough to dent Tuesday — and three separate calendars in the Basin district have been treated for sagging. One, in Doncaster, has collapsed entirely and is now observing a four-day week of its own volition.</p>
      <p>Traders reacted with the discipline the Exchange is famous for: MUD closed stable; PORK rose 4.1 on rumours the limp will affect pigs unevenly; BONE fell a catastrophic 88.9 points as skeletons, ever sensitive to fiscal weather, began pre-emptively rattling. Trading in all weekday futures is suspended until the limp resolves or is renamed.</p>
      <p>"A 4-ounce afternoon is a serious instrument," the chair told reporters, holding up a Thursday for inspection. It bent. Several reporters bent with it. "Citizens will notice lighter Thursdays almost immediately. We ask only that they do not lean on them, do not fold them, and under no circumstances attempt to re-fold a Thursday they have already used."</p>
      <p>The re-folding warning connects the measure to Mandate #409-B, now in force across the Basin, concerning receipts that have learned to recognise footsteps (see the Mandate register and the separate dispatch on receipt conduct). The Reserve declined to confirm whether the two instruments share a draughtsman. The draughtsman declined to comment, citing damp.</p>
      <p>Friday, contacted for reaction, was unavailable. Friday is always unavailable after a cut. This is, the Exchange notes, "exactly the limp we paid for."</p>
    `,
    updates: [
      { time: '15:30', text: 'BONE futures halt extended to the weekend. Exchange floor swept of small rattling sounds.' },
    ],
    related: ['story-receipt', 'story-shed', 'story-lentils'],
    comments: [
      { author: 'Calendar of Doncaster', badge: 'Current State: Collapsed (Content)', text: 'Four days is plenty. I never liked Thursdays and now I can prove it fiscally.', when: '1 CYCLE AGO' },
    ],
  },

  'story-lentils': {
    title: 'DO NOT LOOK IN THE PANTRY: YOUR DRIED LENTILS HAVE RE-ELECTED THEIR OWN SULLEN CHANCELLOR',
    subhead: 'Turnout 100%. Opposition suppressed by absorption. The Chancellor has announced a policy of "continued sullenness."',
    desk: 'domestic',
    tag: 'PANTRY POLITICS',
    tags: ['lentils', 'pantry', 'elections', 'chancellor', 'pulses'],
    authorId: 'archie-clack',
    authorRole: 'Pantry Politics Correspondent',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    caption: 'The Chancellor (centre jar) addressing the shelf. Note the opposition, soaked overnight.',
    credit: 'CONDIMENT DETECTIVE, EVIDENCE #112',
    filed: '3 HOURS AGO',
    published: '2025-09-30T03:30:00Z',
    cycle: '91,204',
    dateline: 'THE PANTRY',
    readWeight: '2.2 OUNCES (DRY WEIGHT)',
    readMinutes: 4,
    body: `
      <p><strong>THE PANTRY</strong> — The dried lentils of at least four hundred Basin households have concluded their second general election of the month, returning the same sullen Chancellor by a margin of every single pulse. Turnout was 100%. It is always 100%. The lentils do not permit abstention; they regard non-voters as "unsoaked."</p>
      <p>The opposition — a reformist faction of red lentils campaigning on faster cooking times and a warmer shelf — was suppressed Thursday night by absorption. Householders who checked their pantries Friday reported the reformists "swollen, merged, and speaking with the Chancellor's voice."</p>
      <p>In his victory address, delivered from the centre jar at a frequency best described as granular, the Chancellor announced a policy of continued sullenness, a five-cycle plan for the strategic soaking of all dissent, and — in the address's only surprise — formal diplomatic recognition of the oats' anagram (see separate dispatch from Lancaster).</p>
      <p>Culinary authorities urge calm and a lid. "Do not look directly into the pantry," advises the Condiment Detective's office. "Observation emboldens pulses. Cook from the side of the eye, and never, under any circumstances, count them aloud. Counting is censusing, and the Chancellor treats a census as an act of war."</p>
      <p>The mustard, currently in custody on suspicion of organizing (see separate dispatch from Skipton), has requested political asylum in the lentil jar. The request is expected to be granted. The mustard wears a small hat now, and the Chancellor, observers note, "has developed a taste for hats."</p>
    `,
    updates: [
      { time: '05:00', text: 'Asylum request granted. Mustard enters jar wearing hat. Shelf morale: sullen but organized.' },
    ],
    related: ['story-oats', 'story-gravy', 'story-tuesday'],
    comments: [
      { author: 'Householder (name soaked)', badge: 'Current State: Watching Sideways', text: 'I cooked from the side of the eye like they said. The Chancellor nodded at me. I have never felt more governed.', when: '1 CYCLE AGO' },
    ],
  },

  'story-lawns': {
    title: '98% OF SUBURBAN LAWNS CONFIRMED TO BE SLEEPING FACE DOWN SINCE WEDNESDAY MORNING',
    subhead: 'Turf survey finds the remaining 2% "awake, watching, and mowing themselves." Council issues guidance on tiptoeing.',
    desk: 'synthetic',
    tag: 'TURF BULLETIN',
    tags: ['lawns', 'sleep', 'suburbs', 'mowing', 'tiptoe guidance'],
    authorId: 'alois-voidgauntlet',
    authorRole: 'Turf Roving Correspondent',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    caption: 'A suburban lawn mid-slumber. Note the deliberate face-down orientation and the untouched edges.',
    credit: 'ROVING BEAST DESK — SHOT FROM A HEDGE',
    filed: '12 HOURS AGO',
    published: '2025-09-29T18:00:00Z',
    cycle: '91,203',
    dateline: 'THE SUBURBS',
    readWeight: '1,900 OUNCES (PER ACRE)',
    readMinutes: 4,
    body: `
      <p><strong>THE SUBURBS</strong> — The Basin Turf Survey has confirmed that 98% of suburban lawns have been sleeping face down since Wednesday morning, in what the survey's registrar calls "the most coordinated rest event in municipal botany."</p>
      <p>The lawns went down together at 6:04 AM. Sprinklers timed for 6:15 watered only air and the occasional embarrassed gnome. Postmen report a district-wide hush broken solely by the sound of one (1) hedge trimmer, operating itself, apologising.</p>
      <p>The remaining 2% — concentrated on the estates of persons who describe themselves as "very busy" — are awake, watching, and mowing themselves. Survey staff approached one such lawn for comment. It trimmed a neat question mark into its own surface and then, when read aloud, closed the question mark into a full stop.</p>
      <p>Council guidance issued this morning asks residents to tiptoe, keep mowers in sheds "until the lawns rise or rise up," and refrain from discussing the 2% within earshot of the 98%. Sleeping turf, the guidance notes, dreams audibly on warm evenings; the dreams are mostly about edges.</p>
      <p>The licensing implications are severe. A sleeping lawn holds a dormant licence; a self-mowing lawn has not filed paperwork since 1994 and is, by every definition this desk is paid to apply, unlicensed fauna of the turf variety. I have left messages with several sufficiently sullen lawns per standing procedure. The messages have been composted. I await germination.</p>
      <p>One solace for households: the sleeping lawns are, the survey confirms, growing faster in their sleep. Whatever they are preparing, they intend to be very green for it.</p>
    `,
    updates: [
      { time: '20:00', text: 'Audible turf dreams reported across three districts. Content: edges. Guidance: do not answer.' },
    ],
    related: ['story-shed', 'story-oats', 'story-canine'],
    comments: [
      { author: 'Postman R. Teale', badge: 'Current State: Tiptoeing', text: 'I have walked the same round for nineteen years. Wednesday it walked back. Politely. Keeping its distance.', when: '6 HOURS AGO' },
    ],
  },

  'story-teeth': {
    title: 'SCIENTISTS DISCOVER REVERSE-TEETH IN 1994 CHEVROLET LUMINA',
    subhead: 'The teeth face inward. They have chewed the odometer back to zero and are now, researchers fear, "getting to know the gearbox."',
    desk: 'calcium',
    tag: 'AUTOMOTIVE OSTEOLOGY',
    tags: ['chevrolet', 'lumina', 'reverse-teeth', 'odometer', 'gearbox'],
    authorId: 'dr-vandermeer',
    authorRole: 'Automotive Osteologist',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    caption: 'Radiograph of the Lumina grille, showing dentition oriented toward the engine bay.',
    credit: 'THE LAMP ROOM, PLATE 12 (AUTOMOTIVE SERIES)',
    filed: 'TUESDAY',
    published: '2025-09-29T09:00:00Z',
    cycle: '91,203',
    dateline: 'A FORECOURT IN TULSA',
    readWeight: '3,400 POUNDS (VEHICLE); 0.9 OUNCES (DENTITION)',
    readMinutes: 4,
    body: `
      <p><strong>A FORECOURT IN TULSA</strong> — Researchers examining a 1994 Chevrolet Lumina of unremarkable history have confirmed the presence of reverse-teeth: a full adult dentition mounted inside the grille, facing the engine bay rather than the road.</p>
      <p>The teeth do not bite outward. They bite inward. The odometer — chewed, according to the service record — has been reduced to zero and reset twice. The radiator has learned to flinch. Most recently, the research team reports, faint chewing sounds have migrated rearward: the dentition is "getting to know the gearbox."</p>
      <p>"A car chews its own history," the lead researcher told this paper, by telephone, from inside the car, which he declined to exit. "This one has eaten thirty-one years and is still hungry. We believe it intends to reach the year it was manufactured and consume that as well. What happens to a vehicle with no birth year is not covered by any manual."</p>
      <p>I have examined the radiographs under my single lamp. The dentition is human-adjacent — molars of a commuting pattern, canines that have seen motorway food — and faintly warm to the plate. When spoken to in low Latin, the grille responded. I will not say how. I am a medical man, and I have stopped saying how.</p>
      <p>Owners of 1994 Luminae are advised to check their grilles with a torch, listen for chewing during cold starts, and under no circumstances park near dental practices, clock shops, or anywhere that keeps years. If your odometer reads zero and you have owned the car since the nineties: it is not a coincidence. It is an appetite.</p>
      <p>The vehicle itself remains on the forecourt. The forecourt, the research team notes, has begun installing a fence "for reasons nobody wishes to discuss at the briefing."</p>
    `,
    updates: [],
    related: ['story-bone', 'story-elbow', 'story-canine'],
    comments: [
      { author: 'Lead Researcher (in car)', badge: 'Current State: Not Exiting', text: 'The chewing has stopped since Tuesday. That is worse. Gearboxes are quiet neighbours.', when: '1 CYCLE AGO' },
    ],
  },

  'story-canine': {
    title: 'REVERSE-CANINE SEEN LURKING BEHIND THE OLD ASBESTOS MILL: DOES NOT BARK, MERELY CONFIRMS RECEIPT OF TAXES',
    subhead: 'Beast desk confirms ninth sighting this quarter. The creature has begun issuing receipts in triplicate.',
    desk: 'synthetic',
    tag: 'BREAKING — BEAST DESK',
    tags: ['reverse-canine', 'asbestos mill', 'taxes', 'receipts', 'unlicensed fauna'],
    authorId: 'alois-voidgauntlet',
    authorRole: 'Roving Beast Correspondent',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    caption: 'The mill yard at dusk. The canine is present in the photograph in the sense that the photograph has been acknowledged.',
    credit: 'ROVING BEAST DESK — THROUGH A WET CRACKER, AT DUSK',
    filed: 'BREAKING',
    published: '2025-09-30T07:05:00Z',
    cycle: '91,204',
    dateline: 'THE OLD ASBESTOS MILL',
    readWeight: 'UNKNOWN (SCALES DECLINE)',
    readMinutes: 5,
    body: `
      <p><strong>THE OLD ASBESTOS MILL</strong> — The reverse-canine was sighted again at dusk behind the mill, the ninth confirmed sighting this quarter and the third in which the creature acknowledged this correspondent directly, by receipt.</p>
      <p>It does not bark. It has never been observed to bark. Witnesses consistently report the same behaviour: the animal regards you for a measured interval, produces from somewhere behind its own silhouette a small stamped slip, and confirms receipt of your taxes. Which taxes. All of them. The slip says so, in a hand that gets smaller toward the total.</p>
      <p>"Reverse" is the licensing office's term, not mine. The creature's orientation is disputed: it walks away from where it is going, its growl precedes its approach by several minutes, and its shadow arrives at destinations a full day early. Two dog-catchers dispatched in August returned having caught only the shadow, which they described as "compliant, cold, and already registered at a different address."</p>
      <p>The mill itself has been closed since 1994 — the same year the Licensing Office shuttered and the same year this correspondent emerged, fully formed, from a hedgerow during an audit. I do not believe in coincidences. I believe in damp, which is coincidence that has been soaking long enough to file paperwork.</p>
      <p>Municipal guidance is unchanged and, I must report, increasingly difficult to follow: do not run (the canine taxes running), do not declare anything aloud (it is already in the slip), and if offered a receipt, accept it. Refusal has consequences the guidance describes only as "fiscal."</p>
      <p>As of filing, the creature remains behind the mill. The mill, witnesses say, has begun leaning away. I will continue my vigil from the hedge. Messages can be left with any sufficiently sullen lawn (see turf bulletin; the lawns are asleep, so leave messages gently).</p>
    `,
    updates: [
      { time: '07:40', text: 'Tenth sighting logged: the canine has been seen reading its own receipts. Morale at the hedge: damp.' },
      { time: '07:05', text: 'BREAKING: ninth sighting confirmed. Triplicate receipts now standard issue.' },
    ],
    related: ['story-receipt', 'story-lawns', 'story-teeth'],
    comments: [
      { author: 'Dog-Catcher (2nd)', badge: 'Current State: Shadowless', text: 'We kept the shadow for a week. It paid its own licensing fee and left. We have questions for the fee office and none for the dog.', when: 'BREAKING' },
    ],
  },

  'story-receipt': {
    title: "CITIZENS WARNED: DO NOT RE-FOLD YOUR RECEIPT FROM TUESDAY — 'IT HAS LEARNED TO RECOGNIZE FOOTSTEPS'",
    subhead: 'Mandate #409-B now in force. Paper conduct across the Basin described by officials as "attentive."',
    desk: 'domestic',
    tag: 'MANDATE #409-B',
    tags: ['receipts', 'mandate', 'paper conduct', 'footsteps', 'tuesdays'],
    authorId: 'gwendolyn-spittle',
    authorRole: 'Paper Conduct Correspondent',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    caption: 'The receipt in question, photographed mid-recognition. Note the creases turning toward the camera.',
    credit: 'PAPER CONDUCT BUREAU, EXHIBIT A',
    filed: 'IN FORCE',
    published: '2025-09-30T06:00:00Z',
    cycle: '91,204',
    dateline: 'THE BASIN',
    readWeight: '0.1 OUNCES (BEFORE RECOGNITION)',
    readMinutes: 4,
    body: `
      <p><strong>THE BASIN</strong> — Under Mandate #409-B, now in force and printed hourly across the top of this paper, citizens are warned not to attempt to re-fold any receipt issued on a Tuesday. The warning exists because one household in the Basin tried, and the receipt — creased, patient, and already warm — recognized the attempt before it was completed.</p>
      <p>"It has learned to recognize footsteps," the Paper Conduct Bureau confirms. Not voices. Not hands. Footsteps. Bureau staff demonstrated with a recording of an empty hallway: the receipt, sealed in an evidence wallet, turned one corner toward the speaker and held it there, like an ear.</p>
      <p>Tuesday paper, the Bureau explains, absorbs the week's damp at its most decisive. A Tuesday receipt does not merely record a transaction; it attends it. Re-folding asks the paper to attend again — and paper that has attended twice begins, in the Bureau's careful phrase, "to expect you."</p>
      <p>The mandate's provisions are simple: do not re-fold; do not smooth; do not iron (several citizens have tried; one iron now recognizes footsteps too). Receipts from other days may be folded once, conventionally, without ceremony. Tuesday receipts should be laid flat, unread, in a drawer that is not your second drawer (see active warnings register).</p>
      <p>Enforcement is administrative. Offenders are not fined. Offenders are, per the mandate, "walked to." Citizens who report their own re-folding within one cycle will receive the standard absolution slip, which is issued — the Bureau assures us — on a Wednesday.</p>
      <p>The fiscal connection is not lost on this desk: the Reserve's emergency cut to the weight of Thursday afternoon (see separate dispatch) lightened every weekday except Tuesday, which has grown, on official scales, heavier by exactly the mass of one folded slip. The draughtsman behind both instruments remains, officially, damp.</p>
    `,
    updates: [
      { time: '06:20', text: 'Bureau confirms: one household iron now recognizes footsteps. Iron impounded, warmly.' },
    ],
    related: ['story-thursday', 'story-tuesday', 'story-canine'],
    comments: [
      { author: 'Reformed Re-folder', badge: 'Current State: Walked To', text: 'I smoothed it. It smoothed back. I have reported myself and the absolution slip is on the kitchen table and it is FACING THE DOOR.', when: 'IN FORCE' },
    ],
  },
});

/* -----------------------------------------------------------------------------
 * TICKER + FLASH + MANDATE STRIP (every scrolling line is a story link)
 * -------------------------------------------------------------------------- */
export const ticker = [
  { text: 'ACTOR TIMOTHÉE CHALAMET REPORTEDLY SEPARATES INTO 16,000 WARM COMMUNION WAFERS DURING RED CARPET INTERVIEW', story: 'story-wafers', tone: 'black' },
  { text: 'PALACE SPOKESMAN CONFIRMS: THE KING’S KNEECAPS ARE ONCE AGAIN ACCUMULATING MIGRATORY CRICKETS', story: 'story-kneecaps', tone: 'red' },
  { text: 'FEDERAL RESERVE CUTS WEIGHT OF THURSDAY AFTERNOON FROM 16oz DOWN TO A LIMP 4oz', story: 'story-thursday', tone: 'black' },
  { text: 'DO NOT LOOK IN THE PANTRY: YOUR DRIED LENTILS HAVE RE-ELECTED THEIR OWN SULLEN CHANCELLOR', story: 'story-lentils', tone: 'red' },
  { text: '98% OF SUBURBAN LAWNS CONFIRMED TO BE SLEEPING FACE DOWN SINCE WEDNESDAY MORNING', story: 'story-lawns', tone: 'black' },
  { text: 'SCIENTISTS DISCOVER REVERSE-TEETH IN 1994 CHEVROLET LUMINA', story: 'story-teeth', tone: 'red' },
];

export const flash = {
  label: 'URGENT CAUTION',
  text: 'REVERSE-CANINE SEEN LURKING BEHIND THE OLD ASBESTOS MILL: DOES NOT BARK, MERELY CONFIRMS RECEIPT OF TAXES',
  story: 'story-canine',
};

export const dispatchStrip = {
  label: 'MANDATE #409-B',
  labelFeature: 'mandate',
  text: 'CITIZENS WARNED: Do not attempt to re-fold your receipt from Tuesday. It has learned to recognize footsteps.',
  story: 'story-receipt',
};

/* -----------------------------------------------------------------------------
 * BASIN METEOROLOGICAL OFFICE (header "Tulsa: 71°F (Oily Mist)" → full bureau)
 * -------------------------------------------------------------------------- */
export const weather = {
  bureau: 'BASIN METEOROLOGICAL OFFICE — TULSA ANNEX (UNDER NEW MANAGEMENT)',
  region: 'The Basin, the Sunk Counties, and adjacent damp',
  observed: {
    temp: '71°F',
    condition: 'Oily Mist',
    humidity: '99.4% COFFEE',
    wind: 'SSW at 4 mph, walking backwards',
    visibility: 'Two drawers',
    pressure: '29.1 inHg and rising resentfully',
    tideOfLard: 'HIGH (Cycle 91,204)',
    sunset: 'Deferred pending paperwork',
  },
  forecast: [
    { day: 'TODAY', high: '71°', low: '58°', condition: 'Oily mist, brief drizzle of small change', advisory: 'Do not re-fold Tuesday receipts outdoors.', precip: '61%' },
    { day: 'WEDNESDAY', high: '69°', low: '55°', condition: 'Shed-weather: lifts of 4 inches likely after 9:15', advisory: 'Secure outbuildings. Do not look underneath.', precip: '20%' },
    { day: 'THURSDAY', high: '74°', low: '57°', condition: 'Noticeably lighter afternoon (4oz, per the Reserve)', advisory: 'Do not lean on Thursday. Do not fold it.', precip: '33%' },
    { day: 'FRIDAY', high: '70°', low: '54°', condition: 'Unavailable', advisory: 'Friday is always unavailable after a cut.', precip: '—' },
    { day: 'SATURDAY', high: '66°', low: '51°', condition: 'Turf dreams, audible after dusk', advisory: 'Do not answer the lawns.', precip: '48%' },
    { day: 'SUNDAY', high: '68°', low: '52°', condition: 'Gravy pressure system moving in from the West Riding', advisory: 'Lids on. Custodial sauce at large.', precip: '72%' },
    { day: 'THE DAMP INTERVAL', high: '67°', low: '50°', condition: 'Formerly Tuesday: overcast with ancestral flour', advisory: 'Do not say the old name near bread.', precip: '55%' },
  ],
  almanac: [
    { phenomenon: 'Tide of Lard', state: 'HIGH', note: 'Peak expected mid-cycle; weigh all spleens before and after.' },
    { phenomenon: 'Moon', state: 'Waning Gravy', note: 'Thickening nightly. Do not photograph through a dry cracker.' },
    { phenomenon: 'Barometer', state: 'HEAVY, WITH A CHANCE OF ALTITUDE', note: 'Shed-owners: see Hexes & Mortgages desk.' },
  ],
  notes: [
    'Observations taken from the under-space beneath Platform 4, Crewe. Instruments licked before each reading per standard practice.',
    'The Tulsa Annex operates under new management. The old management is listed in the Gazette of Absence and continues to forecast by postal proxy.',
  ],
};

/* -----------------------------------------------------------------------------
 * THE SPLEEN EXCHANGE (masthead box → full market board)
 * -------------------------------------------------------------------------- */
export const markets = {
  exchange: 'THE SPLEEN EXCHANGE',
  session: 'CYCLE 91,204 — TRADING SUSPENDED IN ALL WEEKDAY FUTURES',
  commodities: [
    { symbol: 'PORK', price: '+4.1', unit: 'guineas/tub', trend: 'up', note: 'Rising on rumours the Thursday limp will affect pigs unevenly.' },
    { symbol: 'BONE', price: '-88.9', unit: 'points', trend: 'down', note: 'Catastrophic fall as skeletons pre-emptively rattle. Floor swept of small sounds.' },
    { symbol: 'MUD', price: 'STABLE', unit: 'per bucket', trend: 'flat', note: 'Mud closes stable, as mud does. One analyst describes mud as "the only honest instrument."' },
    { symbol: 'LARD', price: '+0.6', unit: 'tides', trend: 'up', note: 'Tide of Lard at HIGH; two tides contracted for winter delivery.' },
    { symbol: 'ENVELOPE GLUE', price: '-2.2', unit: 'flakes', trend: 'down', note: 'Falling on Solihull dietary reports. Family of six consuming supply directly.' },
    { symbol: 'TURNIP FUTURES', price: '+1.4', unit: 'bushels', trend: 'up', note: 'Supported by the 1898 stamp incident at Balmoral. Small turnips scarce.' },
    { symbol: 'DRIPPINGS', price: '+0.9', unit: 'jars', trend: 'up', note: 'Salted dripping demand up on staircase-curing rumours. Verify before applying to risers.' },
    { symbol: 'SECOND-DRAWER NOISES', price: 'UNPRICED', unit: '—', trend: 'flat', note: 'Trading halted. The noise is not subsidized by the Crown (see warnings register).' },
  ],
  indices: [
    { name: 'BASIN DAMP COMPOSITE', value: '9,120.4', change: '+0.4%', trend: 'up' },
    { name: 'STANDARD TUB ACT WEIGHTED Spleen INDEX', value: '14.2 oz', change: 'UNCHANGED', trend: 'flat' },
    { name: 'MELANCHOLY BASKET (dried cod futures)', value: '811.7', change: '-1.1%', trend: 'down' },
  ],
  hours: 'Trading hours: between tides. The bell is the Basin Bell; it tolls, it does not open the market — the market opens itself, grudgingly.',
  disclaimer: 'All spleens weighed according to the 1922 Standard Tub Act. The High Coroner calibrates the tub. This board is original fiction of the present operator; any resemblance to an actual exchange is a matter for the Exchange.',
};

/* -----------------------------------------------------------------------------
 * BUREAU OF WARNINGS (masthead "OFFICIAL WARNING" box → active register)
 * -------------------------------------------------------------------------- */
export const warnings = {
  bureau: 'BUREAU OF WARNINGS — ACTIVE REGISTER',
  active: [
    {
      id: 'WARN-409-B',
      severity: 'MANDATE (IN FORCE)',
      headline: 'The sound currently emanating from your second drawer is NOT subsidized by the Crown.',
      guidance: 'Disregard its pleas. Do not re-fold Tuesday receipts in the drawer’s presence. Lay paper flat, unread, elsewhere.',
      story: 'story-receipt',
    },
    {
      id: 'WARN-CAL-3',
      severity: 'AMBER',
      headline: 'Greater Crewe ceramic alert raised to AMBER: two full teapot articulations confirmed since Friday.',
      guidance: 'Tap all vessels with a dry walnut at dusk. Wooden paddle only for spouts. Under no circumstances use iron.',
      story: 'story-bone',
    },
    {
      id: 'WARN-TURF-1',
      severity: 'ADVISORY',
      headline: 'Sleeping turf: 98% of suburban lawns face down since Wednesday 06:04.',
      guidance: 'Tiptoe. Keep mowers shedded. Do not discuss the awake 2% within earshot of the sleeping 98%.',
      story: 'story-lawns',
    },
    {
      id: 'WARN-BST-9',
      severity: 'RED',
      headline: 'Reverse-canine active behind the old asbestos mill (ninth sighting this quarter).',
      guidance: 'Do not run. Do not declare anything aloud. If offered a receipt, accept it.',
      story: 'story-canine',
    },
    {
      id: 'WARN-FLF-2',
      severity: 'NOTICE',
      headline: 'Urban navel lint forming parliamentary subcommittees (three in five deposits).',
      guidance: 'Do not bathe aggressively during tariff debates. Report Royal Assent knockings to the Ministry of Wool.',
      story: 'story-lint',
    },
  ],
};

/* -----------------------------------------------------------------------------
 * MANDATE #409-B (header badge → full instrument)
 * -------------------------------------------------------------------------- */
export const mandate = {
  id: '409-B',
  title: 'MANDATE #409-B — ON THE CONDUCT OF TUESDAY PAPER',
  issued: 'Cycle 91,204, at the turn of the lard tide',
  issuer: 'The Paper Conduct Bureau, under delegated authority from the Court of the Marrow',
  status: 'IN FORCE — PRINTED HOURLY ACROSS THE TOP OF THIS BROADSHEET',
  summary: 'An instrument governing the folding, smoothing, and ironing of receipts issued on Tuesdays, following confirmed incidents of paper recognition.',
  clauses: [
    'I. No citizen shall re-fold, smooth, or iron a receipt issued on a Tuesday. The paper has learned to recognize footsteps and does not consent to being folded twice.',
    'II. Tuesday receipts shall be laid flat, unread, in a drawer that is not the citizen’s second drawer. The second drawer is under separate notice (WARN-409-B).',
    'III. Receipts of other days may be folded once, conventionally, without ceremony.',
    'IV. Citizens who report their own re-folding within one cycle shall receive the standard absolution slip, issued on a Wednesday.',
    'V. Enforcement is administrative. Offenders are not fined. Offenders are walked to.',
    'VI. Any iron that has recognized footsteps shall be impounded warmly and shall not be returned until it forgets, which irons do not.',
  ],
  enforcement: 'Paper Conduct Bureau wardens, identifiable by their creases. Wardens carry no weapons; they carry folds.',
  history: [
    { cycle: '91,190', text: 'First incident: a smoothed slip in Doncaster turns one corner toward the smooother, like an ear.' },
    { cycle: '91,199', text: 'Bureau demonstration: sealed receipt responds to recording of empty hallway. Corner held for four minutes.' },
    { cycle: '91,204', text: 'Mandate #409-B enters force. Thursday afternoon cut to 4oz by the Reserve; Tuesday grows heavier by exactly one folded slip.' },
  ],
  story: 'story-receipt',
};

/* -----------------------------------------------------------------------------
 * THE BASIN BELL (header button → belfry panel with audible toll)
 * -------------------------------------------------------------------------- */
export const bell = {
  name: 'THE BASIN BELL (ST. LUKE’S COPY)',
  cast: '1894, from confiscated spoons and one (1) surrendered trowel',
  weight: '14.2 ounces — the Standard Tub Act reading weight',
  tollsTo: '40,208 recorded tolls since casting (ledger incomplete; the ledger itself has tolled twice)',
  instructions: [
    'All citizens must submerge their left elbow in tea until the Mayor completes his breakfast.',
    'Do not toll during a teapot articulation (AMBER ceramic alert); the bones answer bells.',
    'If the bell tolls on its own, it is not an emergency. It is a Tuesday somewhere else.',
  ],
  schedule: [
    { time: '06:00', event: 'Dawn agitation' },
    { time: '09:15', event: 'Shed ascent (Dulwich and environs)' },
    { time: '12:00', event: 'Weighing of the spleens' },
    { time: '18:00', event: 'Turf dream-hour (silent toll)' },
    { time: '02:00–04:15', event: 'Mirror hours — do not toll; the hall mirrors are thirsty' },
  ],
};

/* -----------------------------------------------------------------------------
 * ALMANAC (header "Cycle 91,204 (Tide of Lard: High)" → cycle dossier)
 * -------------------------------------------------------------------------- */
export const almanac = {
  cycle: '91,204',
  name: 'Standard Agitation (2025)',
  tide: 'Tide of Lard: HIGH',
  moon: 'Waning Gravy',
  curiosities: [
    'The cycle counter increments hourly. It has never been observed to skip, and it has twice been observed to gloat.',
    'Cycle 91,203 lost a calendar (Doncaster, collapsed, content). Cycle 91,204 has found one; the calendar declines to say where.',
    'Readers who have counted along at home are asked to stop; the count has begun counting back.',
  ],
  editions: ['Standard Agitation (2025)', 'Moisture Leak Mode', '1977 Attic Microfiche'],
};

/* -----------------------------------------------------------------------------
 * HOURLY CITIZEN VOTE (structured poll with real tallies + past polls)
 * -------------------------------------------------------------------------- */
export const poll = {
  id: 'poll-mirror-91204',
  question: 'Did your hall mirror ask you for a glass of tap water between 2:00 AM and 4:15 AM last night?',
  askedAt: 'Cycle 91,204, mirror hours',
  ledger: 'BASIN LEDGER #4',
  options: [
    { id: 1, letter: 'A', text: 'Yes, and it drank it greedily', votes: 1284 },
    { id: 2, letter: 'B', text: 'No, it demanded mutton dripping', votes: 541 },
    { id: 3, letter: 'C', text: 'I broke it with a brick in 2008', votes: 180 },
  ],
  archive: [
    { cycle: '91,203', question: 'Has your bread bin begun voting as a bloc?', winner: 'YES (68%)', result: 'The bin now caucuses with the lentils. Absorption talks ongoing.' },
    { cycle: '91,202', question: 'Did the wallpaper hum a hymn from the reign of William IV this week?', winner: 'IT HUMMED (54%)', result: 'Solihull district skews the count; attics counted separately for the first time.' },
    { cycle: '91,201', question: 'Do you greet the reverse-canine’s shadow when it arrives early?', winner: 'I GREET IT (61%)', result: 'Greeting is not required. Greeting is merely advised, warmly, from a distance.' },
    { cycle: '91,200', question: 'Your teapot chattered at dusk. You: ', winner: 'POURED ANYWAY (47%)', result: 'Forty-seven percent poured anyway. The Osteological Society has asked us to stop running this poll.' },
  ],
};

/* -----------------------------------------------------------------------------
 * HOROSCOPE OF CALAMITY (all twelve signs — front-page box + full chart)
 * -------------------------------------------------------------------------- */
export const horoscope = {
  title: 'HOROSCOPE OF CALAMITY',
  source: 'Cast hourly by the Department of Damp from the humidity of public sorrow. Do not read your neighbour’s sign; their calamity is load-bearing.',
  signs: [
    { name: 'ARIES', symbol: '♈', dates: 'Mar 21 – Apr 19', element: 'Damp Fire', reading: 'A door you have already opened will ask to be opened again. Open it. Behind it is the same room, slightly better furnished, and a version of Tuesday that owes you money.', mood: 'Combustible', numbers: '4, 14, 41', warning: 'Do not headbutt the second drawer.', affinity: 'Warm bricks, poorly wrapped' },
    { name: 'TAURUS', symbol: '♉', dates: 'Apr 20 – May 20', element: 'Earth (Saturated)', reading: 'A stranger will attempt to hand you a warm brick wrapped in flannel. Accept it, but do not look into the chimney from which it was extracted. The brick remembers the fire; the flannel does not, and that is flannel’s mercy.', mood: 'Stubbornly moist', numbers: '6, 16, 61', warning: 'The brick will be returned to you twice. Keep it the third time.', affinity: 'Vestibules, peat, approving nods' },
    { name: 'GEMINI', symbol: '♊', dates: 'May 21 – Jun 20', element: 'Air (Reused)', reading: 'Your two selves have scheduled a meeting and forgotten to invite the one that speaks. Bring a saucer of warm milk; the meeting will adjourn itself into your better ear.', mood: 'Twinned', numbers: '2, 12, 22', warning: 'Do not answer both telephones.', affinity: 'Small apologies, draining boards' },
    { name: 'CANCER', symbol: '♋', dates: 'Jun 21 – Jul 22', element: 'Shell-water', reading: 'The pantry has noted your recent absence and elected, in your honour, a small sullen vice-chancellor. Attend the inauguration or the lentils will attend you.', mood: 'Shell-shocked (fondly)', numbers: '7, 17, 70', warning: 'Cook from the side of the eye.', affinity: 'Lids, jars, reasonable distances' },
    { name: 'LEO', symbol: '♌', dates: 'Jul 23 – Aug 22', element: 'Fire (Oily)', reading: 'You will be mistaken for a celebrity at a red carpet that is 90% jelly. Do not correct the crowd; sink gracefully to the ankles and accept the cufflink. Your mane will be dry-cleaned by an ungrateful otter at no cost.', mood: 'Sticky majesty', numbers: '9, 19, 90', warning: 'Heels deeper than three inches become permanent fixtures. Wear flats. Wear them proudly.', affinity: 'Wooden trowels, applause (distant)' },
    { name: 'VIRGO', symbol: '♍', dates: 'Aug 23 – Sep 22', element: 'Earth (Sifted)', reading: 'Your spine has decided to adopt the metrics of the French Republic. Prepare to measure your joy in decilitres of vinegar, your sorrow in centimetres of clean hallway, and your lint — carefully — in draft bills.', mood: 'Metric', numbers: '5, 15, 51', warning: 'Do not file the lint alphabetically. It has its own order and the order is against you.', affinity: 'Pillboxes, labelled, locked' },
    { name: 'LIBRA', symbol: '♎', dates: 'Sep 23 – Oct 22', element: 'Air (Weighed)', reading: 'A scale you trust will lie to you once, politely, before the tide turns. Weigh your spleen before and after all decisions this cycle. The difference is your judgement; the tub does not round up.', mood: 'Balanced (leaning)', numbers: '11, 21, 112', warning: 'Do not mediate between the mustard and the lentils.', affinity: 'Standard Tub Act, calibrated friends' },
    { name: 'SCORPIO', symbol: '♏', dates: 'Oct 23 – Nov 21', element: 'Water (Held Grudges)', reading: 'Something you buried in 2008 has kept its receipt and intends to file it. Let it. The absolution slip is issued Wednesday; by Thursday the grudge will have recognized your footsteps and settled, warmly, into the second drawer.', mood: 'Vindicated', numbers: '13, 31, 113', warning: 'Do not smooth the slip.', affinity: 'Evidence wallets, patient corners' },
    { name: 'SAGITTARIUS', symbol: '♐', dates: 'Nov 22 – Dec 21', element: 'Fire (Roaming)', reading: 'A hedge you have passed a thousand times will offer you a lanyard. Accept it. Your press credentials have expired in a jurisdiction you have never visited, and the hedgerow remembers your byline.', mood: 'Accredited', numbers: '3, 33, 94', warning: 'Do not photograph anything through a dry cracker this cycle. Wet only.', affinity: 'Forecourts, long walks away from where you are going' },
    { name: 'CAPRICORN', symbol: '♑', dates: 'Dec 22 – Jan 19', element: 'Earth (Compounded)', reading: 'Your outbuilding will rise four inches without asking, and the council will write to you about it. Pay in rakes — three, matching — and do not inspect the shadow beneath. The shadow is nine inches too large and the nine inches are yours.', mood: 'Aerostatic', numbers: '8, 18, 84', warning: 'Salt the hinges on Wednesday mornings.', affinity: 'Tripod cases of salt, humming doors' },
    { name: 'AQUARIUS', symbol: '♒', dates: 'Jan 20 – Feb 18', element: 'Air (Poured)', reading: 'The tap water will taste of an old broadcast. Drink anyway; the broadcast is yours, from a cycle you have not lived yet, in which you are calmer and slightly more liquid.', mood: 'Receiving', numbers: '1, 20, 402', warning: 'Do not tune the radio between 2:00 and 4:15. The mirrors are thirsty and the static answers for them.', affinity: 'Carrier snails, copy filed hourly' },
    { name: 'PISCES', symbol: '♓', dates: 'Feb 19 – Mar 20', element: 'Water (Unremembering)', reading: 'Water will not remember you today. Stay away from shallow puddles; they are currently under lease to the Ministry of Dredging. Deep water, by contrast, has forgotten everything and will treat you as new, which is the only kindness water performs.', mood: 'Unremembered', numbers: '12, 19, 122', warning: 'Do not sign the puddle lease. Do not read the puddle lease.', affinity: 'Canals (porridge-free), new introductions' },
  ],
};

/* -----------------------------------------------------------------------------
 * THE SPITE FLUTE — 34 WHISPERS OVERHEARD (all pre-populated)
 * -------------------------------------------------------------------------- */
export const whispers = {
  columnist: 'lady-hiss',
  column: 'THE SPITE FLUTE',
  count: 34,
  categories: ['HOLLYWOOD', 'PALACE', 'BASIN', 'COMMERCE', 'SPORT'],
  items: [
    { n: 1, desk: 'HOLLYWOOD', text: 'Which actor was spotted feeding his own passport to an ungrateful otter behind the Beverly Hills dry cleaners? His surname rhymes with *Marrow* and he hasn’t blinked in 38 months.' },
    { n: 2, desk: 'HOLLYWOOD', text: 'A certain A-lister’s acceptance speech was delivered from the ankles down. The carpet kept the statuette. The carpet is now, technically, the winner of record.' },
    { n: 3, desk: 'HOLLYWOOD', text: 'Sixteen thousand wafers attended three after-parties, a christening, and a light lunch in Pasadena. The christening is winning the recount.' },
    { n: 4, desk: 'HOLLYWOOD', text: 'A publicist was seen gathering talent into a hat. The talent has since unionised (numbers 8,900–8,940) and demands a bread basket with a view.' },
    { n: 5, desk: 'HOLLYWOOD', text: 'Next year’s ceremony carpet will be gravel. The seventeen cufflinks have been invited back; four are engraved; one junior upholsterer wants his.' },
    { n: 6, desk: 'HOLLYWOOD', text: 'A leading man of the method school has been living inside a 1994 Lumina "for the role." The grille has begun living outside him, for balance.' },
    { n: 7, desk: 'PALACE', text: 'The King’s kneecaps host migratory crickets again — third stopover since the coronation. The chirping is in the anthem’s key, three semitones flat, and extremely well-travelled.' },
    { n: 8, desk: 'PALACE', text: 'A third glove (left-handed) was purchased from a travelling haberdasher of no fixed parish. The haberdasher has fixed a parish since, and won’t name it.' },
    { n: 9, desk: 'PALACE', text: 'The weigh-in ledger at Balmoral bears a hand matching none of the six attending clerks. It reads "THIRD (SEE ALSO: 1952)" and draws a confident turnip.' },
    { n: 10, desk: 'PALACE', text: 'Two junior equerries fainted in the approved order — tallest first. The order is codified. The codifier is also an equerry.' },
    { n: 11, desk: 'PALACE', text: 'The left knee is to be left unoccupied for the wintering pair. Which pair. What species. The spokesman says: "Guests are guests." I say: crickets with visas.' },
    { n: 12, desk: 'PALACE', text: 'One cricket’s 2023 visa was stamped by a legation that does not exist and possibly never has. The entomologist does not intend to see the second page. Neither, gently, should you.' },
    { n: 13, desk: 'BASIN', text: 'A Solihull staircase has been climbing for a fortnight and a moustache named Henderson has been trimming for exactly as long. Neither will be first to speak.' },
    { n: 14, desk: 'BASIN', text: 'The surveyors sent to measure the moustache returned only their theodolite, by post, with a note: "DO NOT MEASURE THE MOUSTACHE." The theodolite has not been seen since it was thanked.' },
    { n: 15, desk: 'BASIN', text: 'A Dulwich shed rises four inches every Wednesday at 9:15. Its shadow is nine inches too large. The extra nine inches wave.' },
    { n: 16, desk: 'BASIN', text: 'Sour plums from a rooted fire-ladder were tasted by one (1) brave neighbour, who described them as "legally complicated." The neighbour has retained solicitors and a jam recipe.' },
    { n: 17, desk: 'BASIN', text: 'The Greater Crewe ceramic alert is AMBER. A pot named Geoffrey answers to it, takes sugar tongs to bed, and has stopped performing its rattles. The silence is the ninth warning sound and the worst.' },
    { n: 18, desk: 'BASIN', text: 'A receipt in an evidence wallet turned one corner toward a recording of an empty hallway and held it, like an ear, for four minutes. The wallet has requested transfer. Request denied; wallets don’t talk.' },
    { n: 19, desk: 'BASIN', text: '98% of lawns sleep face down. The awake 2% mow themselves and, approached for comment, trimmed a question mark into their own surface — then closed it into a full stop.' },
    { n: 20, desk: 'BASIN', text: 'A hall mirror asked for tap water between 2:00 and 4:15 and drank it greedily (64% of you). The 27% whose mirrors demanded mutton dripping: you are not outliers. You are early.' },
    { n: 21, desk: 'COMMERCE', text: 'BONE fell 88.9 points as skeletons pre-emptively rattled. One broker describes the floor as "audible." Another describes it as "knitting." Only one of them is still employed.' },
    { n: 22, desk: 'COMMERCE', text: 'Thursday afternoon now weighs four ounces. It bends. Reporters bend with it. Friday, contacted for reaction, was unavailable — Friday is always unavailable after a cut.' },
    { n: 23, desk: 'COMMERCE', text: 'The lentil Chancellor has granted the mustard political asylum and, per sources inside the jar, "developed a taste for hats." The hat is small. The taste is not.' },
    { n: 24, desk: 'COMMERCE', text: 'Turnip futures are up on the 1898 stamp incident. A small turnip, depicted on said stamp, has not commented and cannot be located, botanically or philatelically.' },
    { n: 25, desk: 'COMMERCE', text: 'DR. VANDERMEER’S LIQUID ASBESTOS SYRUP sales are "brisk and legally fine." The doctor reviews his own syrup. The paper’s editors call the arrangement fine, technically.' },
    { n: 26, desk: 'COMMERCE', text: 'RENT A CHILLED GRANDFATHER has extended to harvest season (60 guineas, free peat). The grandfathers sit in vestibules, do not know the year, and nod approvingly at mistakes. Demand among mistake-makers: high.' },
    { n: 27, desk: 'SPORT', text: 'The Charity Breakfast oats recognised the Mayor, turned sullen and salty, and refused to boil at 200°C. The thermal lance produced a hissing transcribed by two attendants as "we have already eaten."' },
    { n: 28, desk: 'SPORT', text: 'The oats have arranged a crude anagram of the Mayor’s middle name. Cook Mary read it, will not repeat it, and has thrown the cauldron into the canal. The canal now smells of Balfour.' },
    { n: 29, desk: 'SPORT', text: 'A left elbow performed the Well-Tempered Clavier at peak commuter hours. Rail staff banned it. The elbow was fitted with a baton and a "PLEASE NO ENCORES" sign. The sign is not working.' },
    { n: 30, desk: 'SPORT', text: 'A woman requested Für Elise from the elbow. The elbow obliged — "not Beethoven; worse; polite." Requests now require a written application and a deposit in low Latin.' },
    { n: 31, desk: 'HOLLYWOOD', text: 'A Sussex preserve works that closed in 1968 supplied something to a certain red carpet. 1968 is also the year this paper was founded in an abandoned cistern. We are looking into the coincidence with our usual calm.' },
    { n: 32, desk: 'PALACE', text: 'The Gazette of Absence has opened a waiting list for the living who feel they should be on it. The list is also, technically, deceased. Join in person; the Hall visits during, never after.' },
    { n: 33, desk: 'BASIN', text: 'The reverse-canine has begun reading its own receipts (tenth sighting). The mill leans away. The hedge where our correspondent keeps vigil has, this cycle, been trimmed — by nothing anyone saw.' },
    { n: 34, desk: 'COMMERCE', text: 'And finally: a dry cleaners in Beverly Hills has sued an otter for ingratitude. The otter has not retained counsel. The otter, per court filings, "has the passport."' },
  ],
};

/* -----------------------------------------------------------------------------
 * KYPO-FM 40.2 (radio widget → station dossier + full schedule)
 * -------------------------------------------------------------------------- */
export const radio = {
  station: 'KYPO-FM',
  freq: '40.2 on the dial that does not exist',
  transmitter: 'One (1) valve transmitter, under-space beneath Platform 4, Crewe. Powered by the tide of lard at high water.',
  nowPlaying: { title: 'The Sound of Six Men Washing a Single Turnip in 1954', loop: '#892', since: 'Before you arrived' },
  schedule: [
    { time: '06:00', program: 'Dawn Agitation', host: 'The Static', desc: 'A continuous low hum with occasional opinions. The opinions are yours, returned slightly damp.' },
    { time: '08:00', program: 'Turnip Hour (Loop #892)', host: 'Six Men (deceased, washing)', desc: 'The archive recording. The turnip has never once come clean.' },
    { time: '10:00', program: 'The Market of Small Sounds', host: 'Grist & Sons (no sons)', desc: 'Spleen Exchange commentary read into a tin. Bone futures audibly rattle.' },
    { time: '12:00', program: 'Weighing of the Spleens', host: 'The High Coroner', desc: 'Silent except for the tub. The tub is not silent. The tub has never been silent.' },
    { time: '14:00', program: 'Thursday Afternoon (Light Version)', host: 'The Reserve', desc: 'Forty years of broadcast compressed into four ounces of airtime. Do not lean on it.' },
    { time: '16:00', program: 'Requests in Low Latin', host: 'The Elbow (G-minor)', desc: 'Listener requests performed by spontaneous osteomusicology. No encores. Encores happen anyway.' },
    { time: '18:00', program: 'Turf Dreams', host: '98% of the Suburbs', desc: 'Field recordings of sleeping lawns. Content: edges. Listeners are advised not to answer.' },
    { time: '02:00', program: 'The Mirror Hours', host: 'Unattributed thirst', desc: 'Broadcast suspends 02:00–04:15 by agreement with the hall mirrors. Static fills in. Static is greedy.' },
  ],
  technical: [
    'The drone you hear is synthesized locally in your own browser (two oscillators, one C2 sawtooth, one sine at 130.8Hz, gain 0.04). No transmission leaves this page.',
    'The valve transmitter is fictional. The hum is not. The hum has been with us since 1968 and predates the cistern.',
  ],
};

/* -----------------------------------------------------------------------------
 * ADVERTISEMENTS (both front-page ads → structured order forms + receipts)
 * -------------------------------------------------------------------------- */
export const ads = {
  grandfather: {
    name: 'RENT A CHILLED GRANDFATHER',
    headline: 'TIRED OF YOUR REGULAR LEGS?',
    pitch: 'He sits in the vestibule. He does not know what year it is. He smells faintly of damp peat and nods approvingly at your mistakes.',
    price: 'ONLY 14 GUINEAS / HALF-FORTNIGHT',
    specs: [
      'Sits in vestibule (supplied); does not know year (guaranteed)',
      'Smells faintly of damp peat; nods approvingly at mistakes (unlimited)',
      'Landing requires sufficiently moist front lawn — wet cracker test advised',
      'Does not speak before tea; speaks only of 1954 after tea',
      'Returnable at any tide; the tide decides the refund',
    ],
    tiers: [
      { id: 'half-fortnight', label: 'HALF-FORTNIGHT', price: 14, unit: 'guineas', note: 'The classic. One grandfather, one vestibule, fourteen nights.' },
      { id: 'full-fortnight', label: 'FULL FORTNIGHT', price: 26, unit: 'guineas', note: 'He begins to suspect the decade. Nodding improves.' },
      { id: 'harvest', label: 'HARVEST SEASON', price: 60, unit: 'guineas', note: 'Free peat. He mistakes the harvest for 1954 and is, by then, correct.' },
    ],
    fields: [
      { name: 'vestibule', label: 'Vestibule dimensions (ft)', type: 'text', placeholder: 'e.g. 4 x 6, draught from the east', required: true },
      { name: 'moisture', label: 'Front lawn moisture', type: 'select', options: ['Insufficiently moist (dispatch refused)', 'Moist (standard landing)', 'Very moist (wet-cracker verified)', 'Broth-like (express landing)'], required: true },
      { name: 'nod', label: 'Preferred nod frequency', type: 'select', options: ['Approving (default)', 'Solemn', 'Occasional, with gravitas', 'Continuous (not recommended near soup)'], required: true },
      { name: 'peat', label: 'Peat scent intensity', type: 'select', options: ['Faint', 'Present', 'Assertive', '1954'], required: false },
      { name: 'notes', label: 'Notes for the grandfather (he will not read them)', type: 'textarea', placeholder: 'He will not read them. He will nod at them.', required: false },
    ],
    receipt: 'GRANDFATHER DISPATCH SCHEDULED. Ensure front lawn is sufficiently moist for landing. Two men in yellow oilskins will carry him in, sit him down, and leave without knowing the year.',
    terms: 'The Syndicate is not responsible for decades he remembers fondly. All grandfathers chill to vestibule temperature within one cycle. Guineas weighed per the 1922 Standard Tub Act.',
  },
  syrup: {
    name: 'DR. VANDERMEER’S LIQUID ASBESTOS SYRUP',
    headline: 'ARE YOUR BONES TOO LOUD?',
    pitch: 'Muffles spontaneous skeletal chattering within 30 solar ticks. Endorsed by the doctor who reviews his own syrup, which the editors call fine, technically.',
    price: 'ONE FLAGON — 3 GUINEAS, 6 SHILLINGS, AND A SMALL PROMISE',
    specs: [
      'Muffles spontaneous skeletal chattering within 30 solar ticks',
      'Effective on teapots (ceramic articulation, AMBER alert districts)',
      'Not effective on elbows mid-Scarlatti — wait for the coda',
      'Tastes of 1954 and low Latin; do not read the label aloud',
      'Shipped by two men in yellow oilskins, buried in your back garden',
    ],
    tiers: [
      { id: 'thimble', label: 'THIMBLE (TRIAL)', price: 2, unit: 'shillings', note: 'One tick of silence. Enough to confirm the bones were yours.' },
      { id: 'flagon', label: 'FLAGON (STANDARD)', price: 3, unit: 'guineas + 6 shillings + a small promise', note: 'Thirty solar ticks per dose. The promise is collected at delivery; keep it small.' },
      { id: 'barrel', label: 'BARREL (PARISH)', price: 40, unit: 'guineas', note: 'For vestries, tea committees, and households with multiple Geoffreys.' },
    ],
    fields: [
      { name: 'loudness', label: 'Current bone loudness', type: 'select', options: ['Audible to me only', 'Audible to the dog', 'Audible to the dog’s solicitor', 'Performing Scarlatti unprompted'], required: true },
      { name: 'ticks', label: 'Solar ticks of silence required (per dose)', type: 'select', options: ['15 (light chatter)', '30 (standard)', '60 (vestry / barrel purchasers)'], required: true },
      { name: 'delivery', label: 'Delivery method', type: 'select', options: ['Bury in back garden (standard, oilskins included)', 'Leave with any sufficiently sullen lawn', 'Post to pantry (NOT RECOMMENDED — see Mandate #409-B)'], required: true },
      { name: 'vessels', label: 'Number of ceramic vessels to be treated', type: 'text', placeholder: 'e.g. 1 pot (answers to Geoffrey)', required: false },
      { name: 'promise', label: 'The small promise (flagon tier)', type: 'text', placeholder: 'Keep it small. They read promises sideways.', required: false },
    ],
    receipt: 'DISPENSATION GRANTED. Your flagon has been buried in your back garden by two men in yellow oilskins. Please dig until your thumbs bleed, or until the bones are quiet, whichever is quieter.',
    terms: 'The Syndicate does not warrant silence against wrens knitted from bone splinters. Iron implements void all dispensations. The doctor reviews his own syrup; readers weigh accordingly.',
  },
};

/* -----------------------------------------------------------------------------
 * ARCHIVAL BASEMENTS (footer editions → full historical edition dossiers)
 * -------------------------------------------------------------------------- */
export const editions = {
  registerNote: 'Four editions survive in the under-cellar of this paper. Each was salt-cured in 1977 and reads back, hourly, to whoever opens the drawer. Contents below are transcribed from the microfiche; where the microfiche disagrees with itself, we print the disagreement.',
  entries: [
    {
      id: 'edition-1904',
      year: '1904',
      title: 'The Great Damp Turnip Panic',
      headline: 'TURNIPS DECLARED DAMP BY ACCLAMATION; CITY HOLDS BREATH FOR ELEVEN DAYS',
      summary: 'The edition in which every turnip in the Basin was found to be damp — not wet, damp, a distinction the panic refused to respect. Lint and yeast first shared a constituency; both have denied it since.',
      curator: 'Curated by Burlap Higgins, Vertical Surveyor (who was, in 1904, a hallway)',
      contents: [
        { tag: 'FRONT PAGE', headline: 'TURNIPS DAMP BY ACCLAMATION', text: 'The assembly of turnips was called to order at noon and dissolved by acclamation at twelve-oh-one, every turnip present being damp. The chair — a dry swede, unverified — abstained and has not been seen since.' },
        { tag: 'PAGE 2', headline: 'CITY HOLDS BREATH FOR ELEVEN DAYS', text: 'Respiration suspended by municipal order to prevent further damping. Bell-ringers exempted; bells do not breathe, though this one has been heard to.' },
        { tag: 'PAGE 4', headline: 'LINT & YEAST FORM COALITION', text: 'First recorded alliance between abdominal fluff and bakery yeast. Platform: damp for all, weekdays for none. The coalition survives today in the ban on repeating Tuesday near bread.' },
        { tag: 'PAGE 7 (ADVERTISEMENT)', headline: 'DRY SWEDS — CAN THEY BE TRUSTED?', text: 'A full-page advertisement, placed by no identifiable party, consisting of the question alone. The Panic Office purchased the remaining stock of the edition to prevent answers.' },
      ],
    },
    {
      id: 'edition-1933',
      year: '1933',
      title: 'Outlawing of the Letter ‘M’',
      headline: 'LETTER ‘M’ OUTLAWED BY ACT OF PARLIAMENT; MENDS ITSELF OVERNIGHT',
      summary: 'For nine months the letter M was unlawful to print, speak, or mend. The paper complied by printing a small vertical gap where M had been. The gaps, readers reported, hummed.',
      curator: 'Curated by Gwendolyn Spittle, Senior Fluff Academic (the Act was drafted, in part, by lint)',
      contents: [
        { tag: 'FRONT PAGE', headline: 'THE OUTLAWING', text: 'By Act of Parliament the letter M was declared unlawful. Enforcement fell to the Paper Conduct Bureau, then in its infancy, armed with folds. M-owners were given one cycle to surrender their letters; most surrendered; several M’s surrendered their owners.' },
        { tag: 'PAGE 2', headline: 'A SMALL VERTICAL GAP', text: 'This paper complied. Where M had been, we printed a gap of exactly one M’s width. Readers wrote in to report the gaps humming — always William IV-era hymns, always slightly flat.' },
        { tag: 'PAGE 5', headline: 'MENDS ITSELF OVERNIGHT', text: 'On the ninth month’s first morning every gap was found filled. The Bureau logged no violation. The Act remained law; the law remained unenforced; the M remained, and remains, insufferable about the whole affair.' },
        { tag: 'PAGE 9 (GAZETTE OF ABSENCE)', headline: 'CLASSIFIED FOR REVENUE PURPOSES: ONE (1) ALPHABET', text: 'The full alphabet was briefly classified as deceased for revenue purposes during the outlawing, pending resolution of the M question. Reclassified living upon the mending. The alphabet has paid its arrears in kind.' },
      ],
    },
    {
      id: 'edition-1968',
      year: '1968',
      title: 'The King Discloses his Gills',
      headline: 'THE KING DISCLOSES HIS GILLS; THE CISTERN IS FOUND; THIS PAPER IS FOUNDED IN IT',
      summary: 'The triple edition of 1968: the royal disclosure, the discovery of the abandoned cistern beneath Crewe, and the founding of KYPO6 within it — all on the same damp afternoon. Lady Hiss joined the staff before the ink was dry, literally.',
      curator: 'Curated by Sister Beatrice, who declines to discuss 1968–1971 ("the gill years")',
      contents: [
        { tag: 'FRONT PAGE', headline: 'THE DISCLOSURE', text: 'The King, addressing the county lard, disclosed his gills. They were, he noted, "hereditary, seasonal, and none of your business." The disclosure was received warmly and wetly; the tide of lard rose nine inches in solidarity.' },
        { tag: 'PAGE 2', headline: 'THE CISTERN', text: 'Surveyors following the solidarity tide discovered an abandoned cistern beneath Crewe, dry except where it wasn’t. The gill years (1968–1971) are recorded only by water levels. The levels are recorded only by this paper.' },
        { tag: 'PAGE 3', headline: 'THIS PAPER IS FOUNDED', text: 'KYPO6 was founded in the cistern on the same afternoon, by parties unnamed, on paper that had not yet been invented. Est. 1968, says the masthead. The cistern says earlier. We print the masthead.' },
        { tag: 'PAGE 6 (PERSONNEL)', headline: 'LADY HISS JOINS THE STAFF', text: 'The Countess of Damp filed her first Spite Flute column before the ink on her contract was dry — literally; the contract was still wet and she wrote on it anyway. Her start date is itself a rumour, which she prefers.' },
      ],
    },
    {
      id: 'edition-2011',
      year: '2011',
      title: 'The Tuesday That Smelled Like Boiled Wool',
      headline: 'TUESDAY SMELLS OF BOILED WOOL FOR NINE HOURS; MINISTRY BEGINS THE ALIGNMENT PROJECT',
      summary: 'For nine hours on an ordinary Tuesday, the day itself smelled of boiled wool. The Ministry of Calendar Alignment was founded that evening. The paper’s own archives describe the smell as "accurate."',
      curator: 'Curated by the Ministry of Calendar Alignment (founded during the events described)',
      contents: [
        { tag: 'FRONT PAGE', headline: 'NINE HOURS OF BOILED WOOL', text: 'From 06:04 to 15:04 the day smelled of boiled wool. Not the air — the day. Citizens reported the smell "from inside the calendar." Two calendars in Doncaster resigned that afternoon; one later collapsed (see Cycle 91,203).' },
        { tag: 'PAGE 2', headline: 'THE ALIGNMENT PROJECT', text: 'The Ministry of Calendar Alignment was founded that evening by persons present, which, the founding charter notes, "was everyone, briefly." First act: the weekday weight survey. Findings led directly to this cycle’s Thursday cut.' },
        { tag: 'PAGE 4', headline: 'WOOL TARIFF DEBATES BEGIN IN ABDOMENS', text: 'First recorded session of a navel-lint subcommittee, debating what would become the 2026 Woolen Tariff. Bathers advised, then as now, not to bathe aggressively during sessions.' },
        { tag: 'PAGE 8 (CLASSIFIED)', headline: 'FOR SALE: ONE TUESDAY, LIGHTLY SMELLED', text: 'A private seller offered "one Tuesday, lightly smelled, no creases." The Ministry purchased and impounded it. Impounded Tuesdays are held flat, unread, per the practice later codified in Mandate #409-B.' },
      ],
    },
  ],
};

/* -----------------------------------------------------------------------------
 * SUBMISSIONS OF PANIC (footer links → four structured forms + receipts)
 * -------------------------------------------------------------------------- */
export const submissions = {
  desk: 'SUBMISSIONS OF PANIC — THE TIP DESK',
  note: 'All submissions are routed, logged, and receipted within one cycle. Receipts are issued on Wednesdays where the matter involves paper. The desk does not accept manuscripts; the desk accepts panic.',
  types: [
    {
      id: 'submit-ceiling',
      label: 'Confess a phantom ceiling',
      formTitle: 'CONFESSION FORM 1 — PHANTOM CEILINGS',
      blurb: 'For ceilings that are not yours, are above yours, or have begun attending. Confession is delivered directly into an owl.',
      fields: [
        { name: 'location', label: 'Room the ceiling attends', type: 'text', placeholder: 'e.g. hallway, second floor (Solihull)', required: true },
        { name: 'height', label: 'Height claimed by the ceiling', type: 'select', options: ['Standard (9ft, unremarkable)', 'Higher than the house permits', 'Lower than the house remembers', 'The ceiling declines to state'], required: true },
        { name: 'blinks', label: 'Does it blink?', type: 'select', options: ['No', 'Yes, on the half-hour', 'Only when addressed', 'It has started winking'], required: true },
        { name: 'confession', label: 'Your confession', type: 'textarea', placeholder: 'Speak plainly. The owl paraphrases.', required: true },
      ],
      receipt: 'YOUR CONFESSION HAS BEEN DELIVERED DIRECTLY INTO AN OWL. The owl paraphrases to the desk within one cycle. Retain your slip.',
    },
    {
      id: 'submit-bones',
      label: 'Register bone complaints',
      formTitle: 'BONE COMPLAINT REGISTER — FORM 2 (CALCIUM DESK)',
      blurb: 'For chattering, humming, or unprompted Baroque performed by your own skeleton or that of your ceramics. The marrow editor replies within seven equinoxes.',
      fields: [
        { name: 'bone', label: 'Bone or vessel affected', type: 'select', options: ['Femur', 'Wrist (standard)', 'Wrist (third)', 'Kneecap', 'Elbow', 'Teapot', 'Other ceramic', 'The whole shelf'], required: true },
        { name: 'noise', label: 'Describe the noise', type: 'text', placeholder: 'e.g. hollow, toothy clatter; hymn, William IV-era, flat', required: true },
        { name: 'time', label: 'Hour of rattling', type: 'text', placeholder: 'Dusk, per standard; state otherwise', required: true },
        { name: 'walnut', label: 'Have you tapped it with a dry walnut?', type: 'select', options: ['Yes — it chattered', 'Yes — it chattered back', 'No walnut in house', 'I am the walnut (see notes)'], required: true },
        { name: 'complaint', label: 'Your complaint', type: 'textarea', placeholder: 'The marrow editor reads all complaints aloud, to the bones, before replying.', required: true },
      ],
      receipt: 'COMPLAINT REGISTERED. The marrow editor will reply within seven equinoxes. If the rattling becomes counterpoint, stop reading this slip and telephone the desk.',
    },
    {
      id: 'submit-aunt',
      label: 'Return an unexploded aunt',
      formTitle: 'RETURN FORM 3 — UNEXPLODED AUNTS',
      blurb: 'For aunts past their detonation deadline, found in cupboards, attics, or attending ceilings uninvited. The canal does not accept unsolicited manuscript flannels; aunts are accepted.',
      fields: [
        { name: 'municipality', label: 'Aunt’s last known municipality', type: 'text', placeholder: 'e.g. Halifax (allotment maintained)', required: true },
        { name: 'years', label: 'Years since detonation deadline', type: 'text', placeholder: 'Whole numbers only; the form flinches at decimals', required: true },
        { name: 'flannel', label: 'Was a manuscript flannel included?', type: 'select', options: ['No (correct)', 'Yes (remove immediately)', 'The flannel included the aunt', 'Unclear — the flannel is speaking'], required: true },
        { name: 'condition', label: 'Aunt’s current condition', type: 'select', options: ['Unexploded (standard)', 'Unexploded (smug)', 'Partially attended', 'Has begun trimming a moustache'], required: true },
        { name: 'notes', label: 'Notes for the canal', type: 'textarea', placeholder: 'The canal reads everything and forwards nothing. Write anyway.', required: true },
      ],
      receipt: 'AUNT LOGGED FOR RETURN. The canal will collect at the next tide of lard. Please retain your slip and, if the slip is your aunt, retain her also.',
    },
    {
      id: 'submit-porridge',
      label: 'Report unsanctioned porridge',
      formTitle: 'PORRIDGE REPORT FORM 4 — UNSANCTIONED VATS',
      blurb: 'For porridge boiling without sanction, recognizing officials, speaking French, or arranging itself into anagrams. The Parish Committee maintains the exclusion zone register.',
      fields: [
        { name: 'type', label: 'Porridge type', type: 'select', options: ['Scottish rolled (standard)', 'Steel-cut (aggressive)', 'Instant (untrustworthy)', 'The vat refuses to identify itself'], required: true },
        { name: 'sanction', label: 'Sanction status', type: 'select', options: ['Never sanctioned', 'Sanction lapsed', 'Sanction denied by the porridge', 'Under negotiation (steam involved)'], required: true },
        { name: 'quantity', label: 'Quantity (bowls)', type: 'text', placeholder: 'e.g. 400+ (see Lancaster dispatch)', required: true },
        { name: 'language', label: 'Language currently spoken by the steam', type: 'select', options: ['None (worst sign)', 'French', 'Low Latin', 'Anagrammatic', 'It is reading my middle name'], required: true },
        { name: 'report', label: 'Your report', type: 'textarea', placeholder: 'Do not count the oats aloud while filing.', required: true },
      ],
      receipt: 'REPORT FILED. Please retain your slip. The Parish Committee will declare an exclusion zone within one cycle; do not enter it, and do not let the steam read this receipt aloud.',
    },
  ],
};

/* -----------------------------------------------------------------------------
 * OCCULT COOKIE POLICY (footer button → the full instrument + real consent)
 * -------------------------------------------------------------------------- */
export const cookieHex = {
  title: 'OCCULT COOKIE POLICY — THE HEXAGONAL TERMS',
  summary: 'We use tracking sigils etched onto small dried cod to measure your melancholy. By existing within four leagues of this broadcast, you surrender your rights to a flat shadow. The full instrument follows; accepting it stores your consent locally, on your own device, where all honest hexes live.',
  clauses: [
    'I. THE SIGILS. Small dried cod carry the tracking sigils. The cod are not harmed; they were already dried, and they enjoy the work. Melancholy is measured hourly and sold to nobody, including you.',
    'II. THE SHADOW. Your rights to a flat shadow are surrendered upon acceptance. Shadows accepted under these terms are leased to a foundry in Leeds and returned, warmer and slightly heavier, at the end of each cycle.',
    'III. LOCAL STORAGE. Your consent, your votes, your comments, your orders, your tolls and your slips are stored in your own browser’s local storage. Nothing is transmitted. The cod do not phone home; the cod are the home.',
    'IV. WITHDRAWAL. Consent may be withdrawn at any tide. Withdrawal does not un-lease the shadow; it merely stops the foundry writing to you about it.',
    'V. THE FOUR LEAGUES. Visitors outside four leagues of this broadcast are governed by their own damp. This paper makes no claim on their melancholy and envies their flat shadows.',
    'VI. REPRODUCTION. Reproduction of these terms in whole or in part is forbidden by the Court of the Marrow, which has never once been asked and would have said yes.',
  ],
  acceptLine: 'CONVERGENCE CONFIRMED: Your shadow has been leased to a foundry in Leeds. Consent recorded locally at {time}.',
  withdrawLine: 'CONSENT WITHDRAWN at the current tide. The foundry has been notified and will stop writing. Your shadow remains, per Clause IV, warmer and slightly heavier.',
};

/* -----------------------------------------------------------------------------
 * FEATURE REGISTRY — every id valid at /?feature=<id>
 * -------------------------------------------------------------------------- */
export const featureIds = [
  'weather', 'markets', 'warnings', 'mandate', 'almanac', 'bell',
  'polls', 'whispers', 'horoscope', 'radio',
  'editions', 'edition-1904', 'edition-1933', 'edition-1968', 'edition-2011',
  'submit-ceiling', 'submit-bones', 'submit-aunt', 'submit-porridge', 'submissions',
  'ad-grandfather', 'ad-syrup',
  'cookie-hex',
  ...Object.keys(authors).map((a) => `author-${a}`),
];

/* -----------------------------------------------------------------------------
 * PURE HELPERS (used by the engine AND by scripts/check-legacy-routes.mjs)
 * -------------------------------------------------------------------------- */
export function getDesk(id) {
  return desks.find((d) => d.id === id) || null;
}

export function getStory(key) {
  return Object.prototype.hasOwnProperty.call(stories, key) ? stories[key] : null;
}

export function getAuthor(id) {
  return Object.prototype.hasOwnProperty.call(authors, id) ? authors[id] : null;
}

export function storiesByDesk(deskId) {
  return Object.entries(stories).filter(([, s]) => s.desk === deskId).map(([k]) => k);
}

export function storiesByAuthor(authorId) {
  return Object.entries(stories).filter(([, s]) => s.authorId === authorId).map(([k]) => k);
}

export function storyKeys() {
  return Object.keys(stories);
}

export const NEWSROOM = Object.freeze({
  desks, authors, stories, ticker, flash, dispatchStrip, weather, markets,
  warnings, mandate, bell, almanac, poll, horoscope, whispers, radio,
  ads, editions, submissions, cookieHex, featureIds,
});
