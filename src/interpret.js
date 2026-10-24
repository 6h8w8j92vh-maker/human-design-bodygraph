// Plain-language reading of a chart for complete beginners: short sentences, no unexplained terms,
// one practical tip per section, including talents, work, relationships and life purpose. Facts follow Jovian Archive (the official source of Ra Uru Hu's
// teachings); everyday advice also draws on Karen Curry Parker's "Understanding Human Design".
// Where the two differ, Jovian is followed. All wording is our own. Needs core.js (HD) loaded first.
(function (root) {
  'use strict';

  const INTRO = [
    'Your chart is a map of how your energy works. It is worked out from your birth date, time and place.',
    'The coloured shapes are the parts of you that always work the same way. The white shapes are where you pick up energy from other people. Black comes from the moment you were born: the side of you that you know. Red comes from about three months before: the side others often see before you do.',
  ];

  const TYPE = {
    'Manifestor': {
      what: 'You are here to start things. Ideas and urges come to you, and you can act on them without waiting for anyone. About 9 in 100 people have this type.',
      rule: 'Tell the people around you what you are about to do, before you do it. You don\'t need their permission; telling them simply takes away resistance.',
      tip: 'Your energy comes in bursts, not all day long. Rest when the burst is over, and go to bed before you are exhausted.',
    },
    'Generator': {
      what: 'You have lots of lasting energy, as long as you use it for things you truly enjoy. About a third of people have this type.',
      rule: 'Wait for something to respond to: a question, a request, an opportunity. Then follow what your gut says yes to, instead of forcing things from your head.',
      tip: 'Use your energy every day, so you go to bed pleasantly tired. When you feel stuck or frustrated, it often means a step forward is close: keep going.',
    },
    'Manifesting Generator': {
      what: 'You have lots of lasting energy and you are fast. You like to do several things at once and often find shortcuts. About a third of people have this type.',
      rule: 'Wait for something to respond to and check with your gut. When it says yes, tell the people around you before you move.',
      tip: 'Doing many things at once is healthy for you. Skipping steps is fine, but check now and then whether you skipped something important. Be patient with people who are slower.',
    },
    'Projector': {
      what: 'You are here to guide others. You see clearly how people and things work, and how they could work better. About 1 in 5 people have this type.',
      rule: 'For the big things in life, like work, love and where you live, wait until someone recognises you and invites you. For everyday things you don\'t need to wait.',
      tip: 'You don\'t have energy for long, hard days like many others do. Rest often and stop before you are tired. Spend your energy on people who truly value you.',
    },
    'Reflector': {
      what: 'All your shapes are white, so you take in and reflect the people and places around you. You can sense how healthy a group or place is. About 1 in 100 people have this type.',
      rule: 'Take about a month before big decisions, and talk them over with people you trust along the way.',
      tip: 'Where you are and who you are with matters more for you than for anyone. Choose places and people that feel good to you.',
    },
  };
  const FEEL = {
    'Manifestor': ['peace', 'anger'], 'Generator': ['satisfaction', 'frustration'],
    'Manifesting Generator': ['satisfaction', 'frustration or anger'], 'Projector': ['success', 'bitterness'],
    'Reflector': ['surprise', 'disappointment'],
  };

  // Authority in plain words: [plain heading, what it is, tip].
  const AUTH = {
    'Emotional': ['Decide when your feelings are calm', 'Your feelings go up and down like a wave. A choice that feels great today may feel different tomorrow. Clarity comes with time.', 'Sleep on important decisions, often for a few nights. Say yes when you feel calm and clear about it.'],
    'Sacral': ['Decide with your gut', 'Your body answers straight away, often as a sound: "uh-huh" for yes, "uhn-uhn" for no. That gut reaction is more reliable than your thoughts.', 'Ask a friend to ask you yes-or-no questions, and notice the sound that comes out before you start thinking.'],
    'Splenic': ['Decide on your first instinct', 'Your body knows right away, as a quiet hunch about what is good or safe for you. The hunch comes only once.', 'Follow the first quiet feeling. If you start to doubt, remember what you felt first.'],
    'Ego Manifested': ['Decide with your heart', 'Your heart knows what you really want. Listen to what you say without thinking: "I want this" or "I don\'t want this".', 'Only promise what you truly want to do. Keeping promises costs you energy, so choose them with care.'],
    'Ego Projected': ['Decide with your heart', 'Your heart knows what you really want. When you talk freely, notice what you say you want.', 'Only say yes to invitations you truly want, and that you have the energy to see through.'],
    'Self-Projected': ['Decide by hearing yourself talk', 'You find out what is right for you by talking it through. Your own voice tells you what you want.', 'Talk a decision over with a friend. You don\'t need their advice: listen to what you say.'],
    'Mental': ['Decide by talking it through', 'You get clear by talking out loud with people you trust, in places that feel right to you.', 'Have a few people who simply listen. They don\'t decide for you; hearing yourself helps you decide.'],
    'Lunar': ['Decide over a full month', 'Your clarity grows as you feel a decision from every angle, over about four weeks.', 'Write a big decision down and check how it feels at different moments in the month.'],
  };

  const LINE = [null,
    ['Investigator', 'You feel safe when you know a lot about something. You like to research before you act.'],
    ['Hermit', 'You have natural talents that others notice before you do. You need time alone to recharge.'],
    ['Martyr', 'You learn by trying things. What doesn\'t work teaches you what does, so mistakes are part of your path.'],
    ['Opportunist', 'Your chances come through people you know. Friendships and your network matter a lot.'],
    ['Heretic', 'People expect you to solve their problems. When your solutions are practical, your good name grows.'],
    ['Role Model', 'Your life has three stages: trying things until about 30, stepping back and watching until about 50, then living as an example for others.'],
  ];

  // Centers: [what it is about, when coloured, when white (tip), self-check question].
  const CENTER = {
    head: ['inspiration and questions', 'You are often inspired, and you inspire others.', 'You pick up other people\'s questions. You don\'t have to find every answer.', 'Am I busy with questions that don\'t really matter to me?'],
    ajna: ['thinking and opinions', 'You think in a steady way and can be sure of your views. Leave room for other people\'s ideas too.', 'You can see many sides of a matter. You don\'t have to make up your mind straight away; write down what you want to remember.', 'Am I pretending to be sure?'],
    throat: ['speaking and taking action', 'You have a steady voice and way of expressing yourself.', 'Your words land best when someone asks for them. You don\'t have to fill silences.', 'Am I talking to get attention?'],
    g: ['who you are and where you are going', 'You have a steady sense of who you are and where you are going.', 'Your sense of direction comes through people and places. Being in the right place brings the right chances.', 'Am I still searching for love and direction?'],
    heart: ['willpower and self-worth', 'You have willpower, but it needs rest too. Make promises you can keep.', 'You have nothing to prove. Be careful with promises, and ask to be paid what you are worth.', 'Am I still trying to prove myself?'],
    spleen: ['instinct, health and timing', 'You have a steady instinct and feel quickly what is good for your body. Trust it.', 'You feel how others are doing. Let go of things, people and habits that are no longer good for you.', 'Am I holding on to something that is not good for me?'],
    solar: ['feelings', 'Your feelings go up and down in waves. That is normal for you; give decisions time.', 'You feel other people\'s emotions strongly, sometimes more than they do. Let them pass through you, and take a break when it gets too much.', 'Am I avoiding a difficult conversation to keep the peace?'],
    sacral: ['life energy and work energy', 'You have lasting energy for work and life, when you use it for things you respond to.', 'You are not built for long, steady working days. Know when enough is enough, and rest before you are exhausted.', 'Do I know when to stop?'],
    root: ['pressure and drive', 'Your drive comes in waves. Get things done when the energy is there, and rest when it is not.', 'You feel pressure from outside to get things done. Things get done when they get done; there is time.', 'Am I rushing just to get rid of the pressure?'],
  };

  const DEFINITION = {
    'Single Definition': 'All your coloured shapes are connected. You usually process things on your own, at your own pace.',
    'Split Definition': 'Your coloured shapes form two separate groups. You may sometimes feel something is missing. People who "fill the gap" can make you feel complete; give decisions a little time and talk with others.',
    'Triple Split Definition': 'Your coloured shapes form three separate groups. Being around many different people, for example in busy places, helps you feel whole.',
    'Quadruple Split Definition': 'Your coloured shapes form four separate groups, which is rare. Take your time with decisions, so every part of you can weigh in.',
    'No Definition': 'None of your shapes are coloured: that is what makes you a Reflector.',
  };

  const CROSS = {
    'Right Angle': 'Your life theme is mostly about your own journey: you live it out, and others benefit along the way.',
    'Juxtaposition': 'Your life theme is a steady, fixed path, a bridge between your own journey and the people you meet.',
    'Left Angle': 'Your life theme is closely tied to the people you meet: it unfolds through relationships and encounters.',
  };
  const QUARTER_PLAIN = {
    'Initiation': 'you find purpose through understanding and ideas',
    'Civilization': 'you find purpose through building and shaping things in the world',
    'Duality': 'you find purpose through relationships and bonds with others',
    'Mutation': 'you find purpose through change and renewal',
  };

  // Work, by type. Facts from Jovian Archive's type descriptions; everyday detail from Parker.
  const WORK = {
    'Manifestor': 'You are best at starting things: new projects, ideas, businesses. Your energy comes in bursts, so a fixed nine-to-five can wear you out. Work where you have freedom, and keep people informed so they don\'t get in your way.',
    'Generator': 'You have lasting energy for work, but only for work you enjoy. A job your gut says yes to keeps you going for years; a job you dread drains you. You grow into mastery step by step, with flat stretches in between that are part of the process.',
    'Manifesting Generator': 'You have lasting energy and you are quick. You do best with variety: several projects or tasks at the same time. You learn fast and find shortcuts; now and then, check whether you skipped a step that matters.',
    'Projector': 'You are best at guiding, managing and advising: seeing how others can use their energy well. You are not built for long, hard working days. Look for roles where people recognise your insight and invite you in, and where you can rest. Your value is your insight, not your hours.',
    'Reflector': 'You take on the mood of the place where you work, so the place and the team matter more for you than the job title. You can sense how healthy a team or company is, which makes you a good judge of it.',
  };
  const WORK_DECIDE = {
    'Emotional': 'Never accept a job or deal on the spot. Sleep on it, often for a few nights, until you feel calm about it.',
    'Sacral': 'When an offer comes, notice your gut\'s first reaction: a clear yes, or not.',
    'Splenic': 'Trust your quick, quiet first hunch about a job or a client. If something feels off, take it seriously.',
    'Ego Manifested': 'Take on only work you truly want to commit to. It is fine to ask what is in it for you.',
    'Ego Projected': 'Take on only work you truly want to commit to. It is fine to ask what is in it for you.',
    'Self-Projected': 'Talk an offer through with someone you trust, and listen to what you say about it.',
    'Mental': 'Talk an offer through with a few people you trust, and notice where you feel at ease.',
    'Lunar': 'Give big work decisions about a month.',
  };

  // Relationships: by type, and by the two lines of the profile (Jovian; Parker's relationship notes).
  const LOVE = {
    'Manifestor': 'Tell your partner about your plans before you act; it keeps the peace. Ask them to tell you theirs too: you will feel more respected.',
    'Generator': 'Let love come to you, and follow your gut: its yes or no is more reliable than a list of reasons.',
    'Manifesting Generator': 'Let love come to you, and follow your gut: its yes or no is more reliable than a list of reasons. Tell your partner what you are about to do.',
    'Projector': 'Being truly seen matters most to you. Wait to be invited into a relationship by someone who recognises who you are.',
    'Reflector': 'Take about a month before you commit. Choose people who do what they say: you can fall in love with someone\'s potential.',
  };
  const LOVE_LINE = [null,
    'you need time to get to know someone well before you feel safe.',
    'you need time alone, and a partner who doesn\'t take that personally. You often need to be asked.',
    'you may fall in and out of love quickly. Take things slowly; time shows what is right.',
    'friendship comes first. Many of your relationships start as friendships, and may end as friendships too.',
    'people see in you what they hope for. Let them get to know the real you step by step, and say clearly what you can and can\'t give.',
    'you long for one true partner for life, and finding them can take time.',
  ];

  // Channels and gates, for the "Go deeper" part.
  const CIRCUIT_PLAIN = {
    'Individual Knowing': 'about being different and bringing something new',
    'Individual Centering': 'about being different and bringing something new',
    'Integration': 'about looking after yourself',
    'Collective Understanding': 'about sharing with others, through patterns and logic',
    'Collective Sensing': 'about sharing with others, through experiences',
    'Tribal Ego': 'about support, family and community',
    'Tribal Defense': 'about support, family and community',
  };
  const GATE = {
    1: 'the need to express yourself creatively', 2: 'knowing which direction to take', 3: 'making a new start work', 4: 'coming up with answers',
    5: 'keeping a steady routine', 6: 'closeness that comes with friction', 7: 'leading by finding your role', 8: 'adding your own style',
    9: 'focusing on the details', 10: 'loving yourself as you are', 11: 'having many ideas', 12: 'choosing your words carefully',
    13: 'listening to other people\'s stories', 14: 'skills that bring money and means', 15: 'living by your own changing rhythm', 16: 'enthusiasm that grows into skill',
    17: 'forming opinions', 18: 'improving what can be better', 19: 'sensing what others need', 20: 'being present in the moment',
    21: 'taking charge of money and things', 22: 'warmth and charm, when the mood is right', 23: 'explaining complex ideas simply', 24: 'thinking things over until they make sense',
    25: 'love for all of life', 26: 'persuading and selling', 27: 'caring for others', 28: 'looking for what makes life worth it',
    29: 'saying yes and seeing it through', 30: 'longing for new experiences', 31: 'leading by influence', 32: 'sensing what will last',
    33: 'stepping back and remembering', 34: 'raw power to act', 35: 'hunger for change and new things', 36: 'growing through emotional ups and downs',
    37: 'friendship and family', 38: 'fighting for what matters to you', 39: 'stirring up others', 40: 'rest after hard work, and time alone',
    41: 'dreaming about new experiences', 42: 'growing by finishing what you start', 43: 'sudden insights', 44: 'a feel for people and patterns',
    45: 'gathering and sharing resources', 46: 'enjoying your body, being in the right place', 47: 'making sense of the past', 48: 'depth and wanting to master things',
    49: 'principles, and changing what is unfair', 50: 'keeping values and caring for others', 51: 'courage in the face of shock', 52: 'stillness and concentration',
    53: 'starting new things', 54: 'ambition to move up', 55: 'rich feelings and changing moods', 56: 'telling stories',
    57: 'intuition in the moment', 58: 'joy in making life better', 59: 'breaking down barriers between people', 60: 'accepting limits so new things can grow',
    61: 'wanting to know the unknowable', 62: 'getting the details right', 63: 'healthy doubt', 64: 'confusion that turns into clarity',
  };
  const CHANNEL = {
    '1-8': ['Inspiration', 'being creative in a way that inspires others'], '2-14': ['The Beat', 'keeping direction, backed by resources'],
    '3-60': ['Mutation', 'bringing change, in fits and starts'], '4-63': ['Logic', 'questioning things and finding logical answers'],
    '5-15': ['Rhythm', 'being in the flow of life'], '6-59': ['Mating', 'closeness and intimacy'],
    '7-31': ['The Alpha', 'leading for the good of all'], '9-52': ['Concentration', 'staying focused'],
    '10-20': ['Awakening', 'living by your own principles'], '10-34': ['Exploration', 'following your own beliefs'],
    '10-57': ['Perfected Form', 'trusting your instincts to look after yourself'], '11-56': ['Curiosity', 'searching, and sharing what you find as stories'],
    '12-22': ['Openness', 'being sociable, depending on your mood'], '13-33': ['The Prodigal', 'collecting experiences and sharing their lessons'],
    '16-48': ['The Wavelength', 'talent that deepens with practice'], '17-62': ['Acceptance', 'organising thoughts and details'],
    '18-58': ['Judgment', 'wanting to correct and improve things'], '19-49': ['Synthesis', 'sensitivity to needs in relationships'],
    '20-34': ['Charisma', 'turning ideas straight into action'], '20-57': ['The Brainwave', 'knowing what to do in the moment'],
    '21-45': ['Money', 'taking the lead with money and resources'], '23-43': ['Structuring', 'original ideas that need the right moment'],
    '24-61': ['Awareness', 'thinking deeply about life'], '25-51': ['Initiation', 'wanting to be first'],
    '26-44': ['Surrender', 'passing on lessons from the past'], '27-50': ['Preservation', 'caring for others and protecting values'],
    '28-38': ['Struggle', 'finding purpose by fighting for it'], '29-46': ['Discovery', 'succeeding by fully committing'],
    '30-41': ['Recognition', 'a strong wish for new experiences'], '32-54': ['Transformation', 'ambition to grow and rise'],
    '34-57': ['Power', 'acting quickly on instinct'], '35-36': ['Transitoriness', 'trying many things'],
    '37-40': ['Community', 'belonging through give and take'], '39-55': ['Emoting', 'moods that feed creativity'],
    '42-53': ['Maturation', 'growing in cycles of starting and finishing'], '47-64': ['Abstraction', 'making sense of experiences'],
  };

  const list = (xs) => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const an = (w) => (/^[AEIOU]/.test(w) ? 'an ' : 'a ') + w;

  // Returns [{ heading, paragraphs: [text], items?: [text], deeper? }]. Plain text, no HTML.
  function reading(c) {
    const out = [];
    out.push({ heading: 'Your chart in one minute', paragraphs: INTRO });

    const t = TYPE[c.type], [good, bad] = FEEL[c.type];
    out.push({ heading: 'Your type: ' + c.type, paragraphs: [
      t.what,
      'Your rule: ' + t.rule,
      'Try this: ' + t.tip,
      'Feeling ' + good + ' means you are on the right track. Feeling ' + bad + ' is a sign to stop and check.',
    ] });

    const [authTitle, authWhat, authTip] = AUTH[c.authority];
    out.push({ heading: 'How to make decisions: ' + authTitle.toLowerCase(), paragraphs: [authWhat, 'Try this: ' + authTip] });

    const [p, d] = c.profile.split('/').map(Number);
    out.push({ heading: 'Your role in life: ' + LINE[p][0] + ' and ' + LINE[d][0] + ' (' + c.profile + ')', paragraphs: [
      LINE[p][0] + ': ' + LINE[p][1],
      p === d ? '' : LINE[d][0] + ': ' + LINE[d][1] + ' Others often see this side of you more than you do.',
    ].filter(Boolean) });

    const defined = HD.ORDER.filter((x) => c.centers[x].state === 'defined');
    const white = HD.ORDER.filter((x) => c.centers[x].state !== 'defined');
    if (defined.length) {
      out.push({ heading: 'What is steady in you', paragraphs: [DEFINITION[c.definition] + (c.bridges.length ? ' People with gate ' + list(c.bridges.map(String)) + ' can connect your groups.' : '')],
        items: defined.map((x) => HD.CENTER_NAMES[x] + ' center (' + CENTER[x][0] + '): ' + CENTER[x][1]) });
    } else {
      out.push({ heading: 'What is steady in you', paragraphs: [DEFINITION[c.definition]] });
    }
    if (white.length) {
      out.push({ heading: 'Where other people affect you', paragraphs: ['In these white areas you pick up energy from others, often more strongly than they feel it themselves. That is not a weakness: it is where you can become wise.'],
        items: white.map((x) => HD.CENTER_NAMES[x] + ' center (' + CENTER[x][0] + '): ' + CENTER[x][2] + ' Ask yourself: ' + CENTER[x][3]) });
    }

    // Talents: the channels, each a fixed talent that is always there.
    if (c.channels.length) {
      out.push({ heading: 'Your talents', paragraphs: ['A channel is a line that is coloured all the way through. Each one is a talent that is always there, and that people around you can count on.'],
        items: c.channels.map(([a, b]) => {
          const key = HD.channelKey(a, b), [name, keynote] = CHANNEL[key];
          return name + ' (' + key + '): ' + keynote + ', ' + CIRCUIT_PLAIN[HD.CIRCUIT[key]] + '.';
        }) });
    } else {
      out.push({ heading: 'Your talents', paragraphs: ['You have no fixed channels. Your talent is reading people and places: you sense how healthy a group or a place is, and you show it back to them.'] });
    }

    out.push({ heading: 'Work', paragraphs: [WORK[c.type], 'Try this: ' + WORK_DECIDE[c.authority]] });

    const inChannel = new Set(c.channels.flat());
    const single = Object.keys(c.active).map(Number).filter((g) => !inChannel.has(g)).sort((x, y) => x - y);
    out.push({ heading: 'Relationships', paragraphs: [
      LOVE[c.type],
      'As ' + an(LINE[p][0]) + ', ' + LOVE_LINE[p] + (p === d ? '' : ' And as ' + an(LINE[d][0]) + ', ' + LOVE_LINE[d]),
      single.length ? 'You may feel a strong pull toward people who have the other half of one of your single gates (see "Go deeper"): together you form a full channel. That pull is real, but on its own it is not a reason to commit; use your way of deciding.' : '',
    ].filter(Boolean) });

    const sun = c.personality[0], earth = c.personality[1], dSun = c.design[0], dEarth = c.design[1];
    out.push({ heading: 'Your life purpose', paragraphs: [
      'Your life theme is called your Incarnation Cross: ' + c.cross.name + '. It is made of four gates: where the Sun and the Earth stood when you were born, and about three months before.',
      CROSS[c.cross.angle] + ' Your Sun gate falls in the Quarter of ' + c.quarter.name + ': ' + QUARTER_PLAIN[c.quarter.name] + '.',
      'You don\'t have to chase this purpose. It shows up by itself as you follow your rule and your way of deciding.',
    ], items: [
      'Gate ' + sun.gate + ', your Sun (the side you know): ' + GATE[sun.gate] + '. This is the strongest theme in your chart.',
      'Gate ' + earth.gate + ', your Earth (what grounds you): ' + GATE[earth.gate] + '.',
      'Gate ' + dSun.gate + ', your red Sun (the side others see): ' + GATE[dSun.gate] + '.',
      'Gate ' + dEarth.gate + ', your red Earth (what grounds you underneath): ' + GATE[dEarth.gate] + '.',
    ] });

    out.push({ heading: 'Where to start', paragraphs: ['You don\'t need to remember all of this. Pick one thing, your rule or how you make decisions, and try it in small daily choices for a few weeks. Notice what changes.'] });

    // Go deeper: single gates, with the gates that would complete them.
    if (single.length) {
      const partners = (g) => HD.CHANNELS.filter(([a, b]) => a === g || b === g).map(([a, b]) => (a === g ? b : a)).sort((x, y) => x - y);
      out.push({ deeper: true, heading: 'Your single gates', paragraphs: ['Each number on your chart is a gate: one specific quality. A single gate is half of a channel. You may feel drawn to people who have the other half.'],
        items: single.map((g) => 'Gate ' + g + ' (' + HD.GATE_NAMES[g] + '): ' + GATE[g] + '. Other half: gate ' + list(partners(g).map(String)).replace(' and ', ' or ') + '.') });
    }
    return out;
  }

  const words = (r, all) => r.filter((s) => all || !s.deeper).reduce((n, s) => n + [s.heading, ...s.paragraphs, ...(s.items || [])].join(' ').split(/\s+/).length, 0);

  // Shared with the page (summary and tap-to-explain panel).
  const CENTER_THEME = Object.fromEntries(Object.entries(CENTER).map(([k, v]) => [k, v[0]]));
  const QUESTION = Object.fromEntries(Object.entries(CENTER).map(([k, v]) => [k, v[3]]));
  const AUTH_PLAIN = Object.fromEntries(Object.entries(AUTH).map(([k, v]) => [k, v[0]]));
  const api = { reading, words, CHANNEL, GATE, QUESTION, CENTER_THEME, CIRCUIT_PLAIN, AUTH_PLAIN, cap };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HDRead = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
