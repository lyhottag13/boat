const script = [
    [
        'There is a boat floating on the water.',
        'Do you approach it?',
        'CHOICE:I\'m going to give you choices now.#Call|2,Swim|3,Walk|4,Think|1',
    ],
    [
        '[5000]He\'s gone, now.',
        'I think he sensed your vibes.',
        'GOTO:2'
    ],
    [
        'You call out to him.',
        'He tilts his head at you, never opening his eyes.',
        'For some reason, you feel like laughing.',
        'GOTO:1'
    ],
    [
        'You pull your sleeves back and leap into the cold water.',
        'The initial plunge sends a wave of cold to bite at your bones. Maybe this wasn\'t such a good idea, after all.',
        'You try to swim back to your original foothold.',
        'Wait, where were you standing before?',
        'GOTO:1',
    ],
    [
        'You walk. There is a strangely warm feeling underneath your soles.',
        'The water might be a considerable distance from your shoes.',
        'You don\'t know, you haven\'t looked down to check.',
        'The man sees you walking towards him.',
        'GOTO:1'
    ]
];

export default script;