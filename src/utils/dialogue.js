const dialogue = [
    [
        'There is a boat floating on the water.',
        'Do you approach it?',
        'I\'d be careful. He seems very happy.',
        'CHOICE:Call|2,Swim|3,Walk|4,Think|1',
    ],
    [
        '[5000]He\'s gone, now.',
        'I think he sensed your vibes.',
        'GOTO:2'
    ],
    [
        'Call!',
        'GOTO:1'
    ],
    [
        'Swim!',
        'GOTO:1',
    ],
    [
        'Walk!',
        'GOTO:1'
    ]
];

export default dialogue;