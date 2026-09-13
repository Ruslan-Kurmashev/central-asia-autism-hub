import type { MilestoneLocaleContent } from './development-milestones';

const cdcBase = 'https://www.cdc.gov/act-early/milestones';

export const DEVELOPMENT_MILESTONES_EN: MilestoneLocaleContent = {
  parentTranslationKey: 'parents-development-milestones',
  parentTitle: 'How children develop from 2 months to 5 years: developmental milestones for parents',
  sheetLabel: 'Parent observation sheet',
  intro:
    'Mark what you observe in your child\'s everyday life. You do not need to ask your child to perform every item in sequence. This sheet is not a test and is not used to make a diagnosis.',
  optionObserved: 'Observed',
  optionNotYet: 'Not observed yet',
  optionUnsure: 'Not sure',
  notesTitle: 'My observations',
  strengthsPrompt: 'What can my child already do well?',
  concernsPrompt: 'What am I unsure or concerned about?',
  examplesPrompt: 'Write down 2-3 specific examples',
  lostSkillsPrompt: 'Has your child stopped using a skill they used before?',
  lostSkillsNo: 'No',
  lostSkillsYes: 'Yes',
  lostSkillsUnsure: 'Not sure',
  lostSkillsDetail: 'If yes, or if you are unsure, write down what changed:',
  specialistPrompt: 'What do I want to ask a professional?',
  nextTitle: 'What to do next',
  nextText:
    'Choosing “Not observed yet” for one or more items does not by itself identify a cause or make a diagnosis. Write down specific examples and discuss them with a professional if you are concerned about your child\'s development.',
  lostSkillsText:
    'If your child has stopped using a skill they previously used regularly, tell a healthcare professional.',
  backLabel: 'Back to all age milestones',
  printLabel: 'Print or save this sheet',
  privacyNote:
    'Marks and notes entered on this page are not sent to the website and are not saved after you close the page.',
  sourceTitle: 'About this material',
  sourceText:
    'These milestones are based on the CDC Learn the Signs. Act Early. program. They are intended to support observation of child development and conversations with professionals. They do not replace standardized developmental screening, medical advice, or professional assessment.',
  ages: [
    {
      key: '2m',
      slug: '2-months',
      label: '2 months',
      intro:
        'By 2 months, most babies already show several simple ways of interacting with people, responding to their surroundings, and moving.',
      sourceUrl: `${cdcBase}/2-months.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            {
              id: '2m-calms',
              title: 'Calms down when spoken to or picked up',
              example: 'For example, your baby is crying but becomes calmer when you pick them up and speak softly.',
            },
            { id: '2m-face', title: 'Looks at your face' },
            {
              id: '2m-happy',
              title: 'Seems happy to see you when you approach',
              example: 'For example, your baby becomes more alert, looks at you, moves, or changes facial expression when you come closer.',
            },
            { id: '2m-smiles', title: 'Smiles when you talk to or smile at them' },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '2m-sounds', title: 'Makes sounds other than crying' },
            { id: '2m-loud', title: 'Reacts to loud sounds' },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '2m-watches', title: 'Watches you as you move' },
            { id: '2m-toy', title: 'Looks at a toy for several seconds' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '2m-head', title: 'Holds their head up while on their tummy' },
            { id: '2m-limbs', title: 'Moves both arms and both legs' },
            { id: '2m-hands', title: 'Opens their hands briefly' },
          ],
        },
      ],
    },
    {
      key: '4m',
      slug: '4-months',
      label: '4 months',
      intro:
        'By 4 months, interaction becomes more active. Many babies try to get attention more often, respond with sounds, and interact with toys more confidently.',
      sourceUrl: `${cdcBase}/4-months.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            { id: '4m-smiles', title: 'Smiles on their own to get your attention' },
            { id: '4m-chuckles', title: 'Chuckles when you try to make them laugh' },
            { id: '4m-attention', title: 'Looks at you, moves, or makes sounds to get or keep your attention' },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '4m-coos', title: 'Makes cooing sounds such as “oooo” or “aahh”' },
            { id: '4m-replies', title: 'Makes sounds back when you talk to them' },
            { id: '4m-voice', title: 'Turns their head toward the sound of your voice' },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '4m-feeding', title: 'If hungry, opens their mouth when they see a breast or bottle' },
            { id: '4m-hands', title: 'Looks at their hands with interest' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '4m-head', title: 'Holds their head steady when you hold them upright' },
            { id: '4m-holds', title: 'Holds a toy when you put it in their hand' },
            { id: '4m-swings', title: 'Swings an arm toward toys or bats at toys' },
            { id: '4m-mouth', title: 'Brings hands to mouth' },
            { id: '4m-elbows', title: 'Pushes up onto elbows or forearms while on their tummy' },
          ],
        },
      ],
    },
    {
      key: '6m',
      slug: '6-months',
      label: '6 months',
      intro:
        'By 6 months, many babies interact more actively with familiar people, experiment with sounds, explore objects, and become more mobile.',
      sourceUrl: `${cdcBase}/6-months.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            { id: '6m-familiar', title: 'Knows familiar people' },
            { id: '6m-mirror', title: 'Likes looking at themselves in a mirror' },
            { id: '6m-laughs', title: 'Laughs' },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '6m-turns', title: 'Takes turns making sounds with you' },
            { id: '6m-raspberries', title: 'Blows raspberries by sticking out their tongue and blowing' },
            { id: '6m-squeals', title: 'Makes squealing or high-pitched sounds' },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            {
              id: '6m-mouth',
              title: 'Puts safe objects in their mouth to explore them',
              note: 'Objects should be safe and large enough that your child cannot choke on them.',
            },
            { id: '6m-reaches', title: 'Reaches to grab a toy they want' },
            { id: '6m-full', title: 'Closes their lips to show they do not want more food' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '6m-rolls', title: 'Rolls from tummy to back' },
            { id: '6m-arms', title: 'Pushes up with straight arms while on their tummy' },
            { id: '6m-sits', title: 'Leans on their hands for support while sitting' },
          ],
        },
      ],
    },
    {
      key: '9m',
      slug: '9-months',
      label: '9 months',
      intro:
        'By 9 months, many babies become more active in interaction and play, use a wider range of sounds, and explore objects more independently.',
      sourceUrl: `${cdcBase}/9-months.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            { id: '9m-strangers', title: 'May be shy, clingy, or fearful around strangers' },
            { id: '9m-expressions', title: 'Shows several different facial expressions' },
            { id: '9m-name', title: 'Looks or turns toward you when you call their name' },
            { id: '9m-leave', title: 'Reacts when you leave' },
            { id: '9m-peekaboo', title: 'Smiles or laughs when you play peek-a-boo' },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '9m-babbles', title: 'Makes repeated sounds such as “mamamama” or “babababa”' },
            { id: '9m-armsup', title: 'Lifts their arms to be picked up' },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '9m-dropped', title: 'Looks for an object that has gone out of sight' },
            { id: '9m-bangs', title: 'Bangs two objects together' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '9m-sit-position', title: 'Gets into a sitting position by themselves' },
            { id: '9m-transfer', title: 'Moves objects from one hand to the other' },
            { id: '9m-rake', title: 'Uses their fingers to rake small pieces of food toward their palm' },
            { id: '9m-sits', title: 'Sits without support' },
          ],
        },
      ],
    },
    {
      key: '12m',
      slug: '1-year',
      label: '1 year',
      intro:
        'By 1 year, many children actively use gestures, begin to understand simple words, play together with adults, and become more independent in movement.',
      sourceUrl: `${cdcBase}/1-year.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [{ id: '12m-games', title: 'Plays simple games with you, such as pat-a-cake' }],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '12m-bye', title: 'Waves “bye-bye”' },
            { id: '12m-parent', title: 'Calls a parent “mama,” “dada,” or another special name' },
            {
              id: '12m-no',
              title: 'Understands “no”',
              example: 'For example, pauses briefly or stops an action when you say “no.”',
            },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '12m-container', title: 'Puts an object into a container, such as a block into a cup' },
            { id: '12m-hidden', title: 'Looks for an object that you hide while they watch' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '12m-stand', title: 'Pulls up to stand' },
            { id: '12m-cruise', title: 'Walks while holding on to furniture' },
            { id: '12m-cup', title: 'Drinks from an open cup while an adult holds it' },
            { id: '12m-pincer', title: 'Picks up small objects between thumb and index finger' },
          ],
        },
      ],
    },
    {
      key: '15m',
      slug: '15-months',
      label: '15 months',
      intro:
        'By 15 months, many children more actively show their interests and wants, copy others, use their first words, and begin moving more independently.',
      sourceUrl: `${cdcBase}/15-months.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            { id: '15m-copies', title: 'Copies other children while playing' },
            { id: '15m-shows', title: 'Shows you an object they like' },
            { id: '15m-claps', title: 'Claps when excited' },
            { id: '15m-hugs-toy', title: 'Hugs a stuffed toy or doll' },
            { id: '15m-affection', title: 'Shows affection to familiar people, for example by hugging or cuddling' },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '15m-words', title: 'Tries to say one or two words besides “mama” or “dada”' },
            { id: '15m-object', title: 'Looks at a familiar object when you name it' },
            { id: '15m-direction', title: 'Follows a simple direction when words are combined with a gesture' },
            { id: '15m-points', title: 'Points to ask for something or to get help' },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '15m-use', title: 'Tries to use familiar objects in the right way, such as a cup, phone, or book' },
            { id: '15m-stack', title: 'Stacks one small object on top of another' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '15m-steps', title: 'Takes a few steps on their own' },
            { id: '15m-fingers', title: 'Uses fingers to feed themselves some pieces of food' },
          ],
        },
      ],
    },
    {
      key: '18m',
      slug: '18-months',
      label: '18 months',
      intro:
        'By 18 months, many children become more independent in movement and everyday activities, more actively share their interests, and begin using more words.',
      sourceUrl: `${cdcBase}/18-months.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            {
              id: '18m-checks',
              title: 'Moves away from you but checks to make sure you are close by',
              example: 'For example, explores a room or playground but looks back at you or returns from time to time.',
            },
            {
              id: '18m-interest',
              title: 'Points to show you something interesting',
              example: 'For example, notices an airplane or a dog, points to it, and looks at you.',
              note: 'The child does not necessarily want the object. They may simply be trying to share their interest with you.',
            },
            { id: '18m-wash', title: 'Puts hands out for you to wash them' },
            { id: '18m-book', title: 'Looks at a few pages in a book with you' },
            {
              id: '18m-dress',
              title: 'Helps you dress them',
              example: 'For example, pushes an arm through a sleeve or lifts a foot when you put on trousers or shoes.',
            },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '18m-words', title: 'Tries to say three or more words besides “mama” or “dada”' },
            {
              id: '18m-direction',
              title: 'Follows a one-step direction without a gesture',
              example: 'For example, you say “Give me the ball” without pointing or holding out your hand, and your child follows the request.',
            },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '18m-chores', title: 'Copies simple household actions, such as pretending to sweep' },
            { id: '18m-toys', title: 'Plays with toys in a simple way, such as pushing a toy car' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '18m-walks', title: 'Walks without holding on' },
            { id: '18m-scribbles', title: 'Scribbles' },
            { id: '18m-cup', title: 'Drinks from a cup without a lid', note: 'Some spilling is common at this age.' },
            { id: '18m-fingers', title: 'Feeds themselves with their fingers' },
            { id: '18m-spoon', title: 'Tries to use a spoon', note: 'It does not need to be neat.' },
            { id: '18m-climbs', title: 'Climbs on and off a couch or chair without help' },
          ],
        },
      ],
    },
    {
      key: '24m',
      slug: '2-years',
      label: '2 years',
      intro:
        'By 2 years, many children use short word combinations, notice other people\'s emotions, play with objects in more varied ways, and move confidently.',
      sourceUrl: `${cdcBase}/2-years.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            { id: '24m-upset', title: 'Notices when other people are hurt or upset' },
            { id: '24m-face', title: 'Looks at your face to see how to react in a new situation' },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '24m-book', title: 'Points to an item in a book when you ask about it' },
            { id: '24m-two-words', title: 'Says at least two words together, such as “more milk” or “mama go”' },
            { id: '24m-body', title: 'Points to at least two body parts when you name them' },
            { id: '24m-gestures', title: 'Uses more gestures than just waving and pointing' },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '24m-two-hands', title: 'Holds something in one hand while using the other hand to do something with it' },
            { id: '24m-switches', title: 'Tries switches, knobs, or buttons on a toy' },
            { id: '24m-toys', title: 'Plays with more than one toy at the same time in the same activity' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '24m-kicks', title: 'Kicks a ball' },
            { id: '24m-runs', title: 'Runs' },
            { id: '24m-stairs', title: 'Walks up a few stairs with or without help' },
            { id: '24m-spoon', title: 'Eats with a spoon' },
          ],
        },
      ],
    },
    {
      key: '30m',
      slug: '30-months',
      label: '2.5 years',
      intro:
        'By 2.5 years, language and play usually become more complex. Many children combine more words, follow two-step directions, and play near or with other children.',
      sourceUrl: `${cdcBase}/30-months.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            { id: '30m-children', title: 'Plays next to other children and sometimes plays with them' },
            { id: '30m-look', title: 'Shows you what they can do by saying “Look at me!” or something similar' },
            { id: '30m-routine', title: 'Follows a simple familiar routine when reminded' },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            {
              id: '30m-50words',
              title: 'Says about 50 words',
              note: 'CDC describes this milestone as about 50 words. This number is not used on its own to make a diagnosis.',
            },
            { id: '30m-action', title: 'Says two or more words together, including an action word, such as “doggie runs”' },
            { id: '30m-book', title: 'Names things in a book when you point and ask “What is this?”' },
            { id: '30m-pronouns', title: 'Uses words such as “I,” “me,” or “we”' },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '30m-pretend', title: 'Uses objects in pretend play, such as pretending a block is food' },
            { id: '30m-problem', title: 'Uses a simple way to solve a problem, such as standing on a small stool to reach something' },
            { id: '30m-two-step', title: 'Follows a two-step direction' },
            { id: '30m-color', title: 'Shows that they know at least one color' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '30m-twist', title: 'Twists things such as doorknobs or suitable lids' },
            { id: '30m-clothes', title: 'Takes off some clothes by themselves' },
            { id: '30m-jumps', title: 'Jumps off the ground with both feet' },
            { id: '30m-pages', title: 'Turns book pages one at a time' },
          ],
        },
      ],
    },
    {
      key: '3y',
      slug: '3-years',
      label: '3 years',
      intro:
        'By 3 years, many children become more active in conversation, join other children in play, and do more everyday activities independently.',
      sourceUrl: `${cdcBase}/3-years.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            { id: '3y-calms', title: 'Usually calms down within about 10 minutes after you leave' },
            { id: '3y-joins', title: 'Notices other children and joins them to play' },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '3y-conversation', title: 'Has a conversation with at least two back-and-forth exchanges' },
            { id: '3y-questions', title: 'Asks “who,” “what,” “where,” or “why” questions' },
            { id: '3y-picture', title: 'Says what is happening in a picture or book, such as “running” or “eating”' },
            { id: '3y-name', title: 'Says their first name when asked' },
            { id: '3y-understood', title: 'Talks well enough for other people to understand most of the time' },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '3y-circle', title: 'Draws a circle after you show them how' },
            { id: '3y-hot', title: 'Avoids touching a hot object after you warn them' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '3y-string', title: 'Strings large safe items together, such as large beads' },
            { id: '3y-dresses', title: 'Puts on some clothes by themselves' },
            { id: '3y-fork', title: 'Uses a fork' },
          ],
        },
      ],
    },
    {
      key: '4y',
      slug: '4-years',
      label: '4 years',
      intro:
        'By 4 years, many children play more actively with others, invent roles and stories, talk about events from their day, and become more independent in simple everyday tasks.',
      sourceUrl: `${cdcBase}/4-years.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            { id: '4y-pretend', title: 'Pretends to be something else during play, such as a teacher, superhero, or animal' },
            { id: '4y-children', title: 'Asks to go play with other children' },
            { id: '4y-comforts', title: 'Comforts other people who are hurt or sad' },
            { id: '4y-danger', title: 'Avoids some obvious dangers' },
            { id: '4y-helper', title: 'Likes to be a helper' },
            { id: '4y-behavior', title: 'Changes behavior based on where they are' },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '4y-sentences', title: 'Says sentences with four or more words' },
            { id: '4y-song', title: 'Says some words from a song, story, or nursery rhyme' },
            { id: '4y-day', title: 'Talks about at least one thing that happened during their day' },
            { id: '4y-purpose', title: 'Answers simple questions about what familiar things are for' },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '4y-colors', title: 'Names a few colors' },
            { id: '4y-story', title: 'Tells what comes next in a well-known story' },
            { id: '4y-person', title: 'Draws a person with three or more body parts' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '4y-ball', title: 'Catches a large ball most of the time' },
            { id: '4y-serves', title: 'Serves themselves food or pours water with adult supervision' },
            { id: '4y-unbuttons', title: 'Unbuttons some buttons' },
            { id: '4y-pencil', title: 'Holds a crayon or pencil between fingers and thumb rather than in a fist' },
          ],
        },
      ],
    },
    {
      key: '5y',
      slug: '5-years',
      label: '5 years',
      intro:
        'By 5 years, many children can maintain longer conversations and attention, tell simple stories, follow game rules, and do more activities independently.',
      sourceUrl: `${cdcBase}/5-years.html`,
      sections: [
        {
          title: 'Social interaction',
          items: [
            { id: '5y-rules', title: 'Follows rules or takes turns when playing games with other children' },
            { id: '5y-performs', title: 'Sings, dances, or acts for you' },
            { id: '5y-chores', title: 'Does simple chores at home, such as matching socks or clearing the table' },
          ],
        },
        {
          title: 'Language and understanding',
          items: [
            { id: '5y-story', title: 'Tells a story with at least two connected events' },
            { id: '5y-questions', title: 'Answers simple questions about a book or story after you read or tell it' },
            { id: '5y-conversation', title: 'Keeps a conversation going with more than three back-and-forth exchanges' },
            { id: '5y-rhymes', title: 'Recognizes or uses simple rhymes' },
          ],
        },
        {
          title: 'Play, learning and thinking',
          items: [
            { id: '5y-counts', title: 'Counts to 10' },
            { id: '5y-numbers', title: 'Names some numbers between 1 and 5 when you point to them' },
            { id: '5y-time', title: 'Uses words about time, such as “yesterday,” “tomorrow,” “morning,” or “night”' },
            { id: '5y-attention', title: 'Pays attention for about 5-10 minutes during activities, not including screen time' },
            { id: '5y-name-letters', title: 'Writes some letters in their name' },
            { id: '5y-letters', title: 'Names some letters when you point to them' },
          ],
        },
        {
          title: 'Movement and independence',
          items: [
            { id: '5y-buttons', title: 'Buttons some buttons' },
            { id: '5y-hop', title: 'Hops on one foot' },
          ],
        },
      ],
    },
  ],
};
