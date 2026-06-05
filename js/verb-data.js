        const IRREGULAR_PAST = {
            be:'was', have:'had', do:'did', go:'went', make:'made',
            see:'saw', come:'came', take:'took', get:'got', give:'gave',
            know:'knew', think:'thought', say:'said', tell:'told', find:'found',
            bring:'brought', buy:'bought', catch:'caught', teach:'taught',
            run:'ran', swim:'swam', sing:'sang', ring:'rang', begin:'began',
            drink:'drank', eat:'ate', fall:'fell', feel:'felt', hear:'heard',
            hold:'held', keep:'kept', leave:'left', lose:'lost', meet:'met',
            pay:'paid', put:'put', read:'read', send:'sent', sit:'sat',
            sleep:'slept', speak:'spoke', spend:'spent', stand:'stood',
            understand:'understood', win:'won', write:'wrote', break:'broke',
            choose:'chose', drive:'drove', forget:'forgot', grow:'grew',
            hide:'hid', hit:'hit', let:'let', ride:'rode', rise:'rose',
            set:'set', shut:'shut', throw:'threw', wake:'woke', wear:'wore',
            fly:'flew', draw:'drew', cut:'cut', hurt:'hurt', cost:'cost'
        };
        const IRREGULAR_PP = {
            be:'been', have:'had', do:'done', go:'gone', make:'made',
            see:'seen', come:'come', take:'taken', get:'gotten', give:'given',
            know:'known', think:'thought', say:'said', tell:'told', find:'found',
            bring:'brought', buy:'bought', catch:'caught', teach:'taught',
            run:'run', swim:'swum', sing:'sung', ring:'rung', begin:'begun',
            drink:'drunk', eat:'eaten', fall:'fallen', feel:'felt', hear:'heard',
            hold:'held', keep:'kept', leave:'left', lose:'lost', meet:'met',
            pay:'paid', put:'put', read:'read', send:'sent', sit:'sat',
            sleep:'slept', speak:'spoken', spend:'spent', stand:'stood',
            understand:'understood', win:'won', write:'written', break:'broken',
            choose:'chosen', drive:'driven', forget:'forgotten', grow:'grown',
            hide:'hidden', hit:'hit', let:'let', ride:'ridden', rise:'risen',
            set:'set', shut:'shut', throw:'thrown', wake:'woken', wear:'worn',
            fly:'flown', draw:'drawn', cut:'cut', hurt:'hurt', cost:'cost'
        };

        // Verb lists by level and type
        const VERB_LISTS = {
            regular: {
                A1: ['walk', 'talk', 'play', 'open', 'close', 'help', 'work', 'watch', 'listen', 'clean', 'cook', 'start', 'stop', 'finish', 'jump'],
                A2: ['travel', 'arrive', 'visit', 'like', 'love', 'hate', 'need', 'want', 'study', 'learn', 'practice', 'ask', 'answer', 'explain', 'happen', 'change'],
                B1: ['describe', 'suggest', 'develop', 'manage', 'organize', 'prepare', 'decide', 'discuss', 'improve', 'provide', 'receive', 'create', 'realize', 'achieve', 'compare'],
                B2: ['demonstrate', 'evaluate', 'establish', 'generate', 'investigate', 'determine', 'implement', 'maintain', 'negotiate', 'participate', 'recognize', 'represent', 'contribute', 'analyze'],
                C1: ['accommodate', 'administer', 'anticipate', 'collaborate', 'conceptualize', 'differentiate', 'eliminate', 'formulate', 'hypothesize', 'incorporate', 'justify', 'manipulate', 'optimize']
            },
            irregular: {
                A1: ['be', 'have', 'do', 'go', 'see', 'come', 'get', 'make', 'say', 'know', 'give', 'take'],
                A2: ['think', 'find', 'run', 'swim', 'eat', 'drink', 'write', 'read', 'buy', 'bring', 'tell', 'put'],
                B1: ['speak', 'break', 'choose', 'drive', 'feel', 'hear', 'hold', 'keep', 'leave', 'lose', 'meet', 'pay', 'ride', 'send', 'sit'],
                B2: ['arise', 'bear', 'beat', 'become', 'bind', 'bite', 'blow', 'build', 'burn', 'burst', 'cast', 'dig', 'draw', 'fall', 'fight', 'fly', 'forget', 'freeze', 'grow', 'hide'],
                C1: ['forbid', 'forsake', 'grind', 'hang', 'kneel', 'lean', 'leap', 'lend', 'let', 'lie', 'light', 'mean', 'mow', 'prove', 'rid', 'rise', 'sew', 'shed', 'shine', 'shrink', 'slay']
            }
        };

        // Rich sentence bank. Each entry has a fixed verb that grammatically fits the sentence.
        // subjKey drives conjugation and must match the grammatical subject already in the template.
        const TENSE_SENTENCE_BANK = {
            present_simple: [
                { template: 'Every morning, Maria __BLANK__ to work instead of taking the bus.', verb: 'walk', subjKey: 'he', clue: 'every morning (habitual routine)' },
                { template: 'Scientists say the Sun __BLANK__ in the east and sets in the west.', verb: 'rise', subjKey: 'he', clue: 'general fact / permanent truth' },
                { template: 'Sofia __BLANK__ three languages fluently, including Mandarin.', verb: 'speak', subjKey: 'he', clue: 'permanent ability / general truth' },
                { template: 'The museum __BLANK__ at nine o\'clock and closes at six.', verb: 'open', subjKey: 'he', clue: 'timetable / scheduled event' },
                { template: 'James __BLANK__ coffee every single day, without exception.', verb: 'drink', subjKey: 'he', clue: 'habitual action' },
                { template: 'I __BLANK__ to the gym every Monday before work.', verb: 'go', subjKey: 'I', clue: 'every Monday (habitual routine)' },
                { template: 'They __BLANK__ dinner together as a family every Sunday.', verb: 'cook', subjKey: 'they', clue: 'every Sunday (habitual routine)' },
                { template: 'The train __BLANK__ at platform 4 at 8:15 sharp.', verb: 'arrive', subjKey: 'he', clue: 'timetable / scheduled event' },
            ],
            present_continuous: [
                { template: 'Look out the window — it __BLANK__ heavily out there!', verb: 'rain', subjKey: 'he', clue: 'look / right now (action in progress)' },
                { template: 'She can\'t come to the phone because she __BLANK__ a shower at the moment.', verb: 'have', subjKey: 'he', clue: 'at the moment (in progress now)' },
                { template: 'The number of electric car users __BLANK__ rapidly this year.', verb: 'grow', subjKey: 'he', clue: 'this year / gradual change around now' },
                { template: 'The workers __BLANK__ a new shopping centre just outside the town.', verb: 'build', subjKey: 'they', clue: 'temporary ongoing project' },
                { template: 'I __BLANK__ harder these days because the exams are getting closer.', verb: 'study', subjKey: 'I', clue: 'these days / temporary situation' },
                { template: 'Lena __BLANK__ her sister\'s apartment while she\'s on holiday.', verb: 'use', subjKey: 'he', clue: 'temporary arrangement' },
            ],
            past_simple: [
                { template: 'Last summer, the friends __BLANK__ across three countries on their motorbikes.', verb: 'travel', subjKey: 'they', clue: 'last summer (completed past action)' },
                { template: 'Elena __BLANK__ the report before the deadline on Friday.', verb: 'finish', subjKey: 'he', clue: 'on Friday / completed action with time reference' },
                { template: 'When he was a child, Tom __BLANK__ to become an astronaut.', verb: 'want', subjKey: 'he', clue: 'when he was a child / past state or habit' },
                { template: 'The earthquake __BLANK__ at exactly 3:17 am and lasted thirty seconds.', verb: 'strike', subjKey: 'he', clue: 'exact time in the past / single completed event' },
                { template: 'I __BLANK__ my keys this morning and was late for everything.', verb: 'lose', subjKey: 'I', clue: 'this morning / completed past action' },
                { template: 'She __BLANK__ the letter, sealed it, and posted it on her way out.', verb: 'write', subjKey: 'he', clue: 'sequence of completed past actions' },
            ],
            past_continuous: [
                { template: 'Clara __BLANK__ to music when she suddenly heard a strange noise outside.', verb: 'listen', subjKey: 'he', clue: 'when + sudden interruption (background action)' },
                { template: 'At midnight last night, the whole team __BLANK__ on the presentation.', verb: 'work', subjKey: 'they', clue: 'at midnight (action in progress at that past moment)' },
                { template: 'While David __BLANK__ the dishes, he accidentally dropped a plate.', verb: 'wash', subjKey: 'he', clue: 'while + simultaneous past event' },
                { template: 'The children __BLANK__ so loudly that nobody could hear the announcement.', verb: 'shout', subjKey: 'they', clue: 'scene-setting — describing background noise' },
                { template: 'I __BLANK__ when the power suddenly went out.', verb: 'read', subjKey: 'I', clue: 'when + interruption — background action' },
            ],
            present_perfect: [
                { template: 'Anna __BLANK__ to Japan three times already, and she\'s planning another trip.', verb: 'travel', subjKey: 'he', clue: 'already / life experience up to now' },
                { template: 'I can\'t find my wallet — I think I __BLANK__ it somewhere.', verb: 'leave', subjKey: 'I', clue: 'result visible now / indefinite past' },
                { template: 'The government __BLANK__ a new law that affects millions of workers.', verb: 'pass', subjKey: 'they', clue: 'recent action with present relevance' },
                { template: 'Mr Harris __BLANK__ in this city for over twenty years and knows every street.', verb: 'live', subjKey: 'he', clue: 'for + duration continuing until now' },
                { template: 'You __BLANK__ the new exhibition at the art gallery yet — it\'s incredible.', verb: 'visit', subjKey: 'you', clue: 'yet / experience up to now (note: use negative form)' },
                { template: 'She __BLANK__ that restaurant before, and she loved it.', verb: 'visit', subjKey: 'he', clue: 'before / past experience up to now' },
                { template: 'She __BLANK__ three cups of coffee this morning and still feels tired.', verb: 'drink', subjKey: 'he', clue: 'this morning / completed action with present relevance' },
            ],
            present_perfect_continuous: [
                { template: 'Sophie __BLANK__ for the marathon for six months, and it really shows.', verb: 'train', subjKey: 'he', clue: 'for six months / activity still in progress' },
                { template: 'I __BLANK__ all morning and I still haven\'t finished the chapter.', verb: 'read', subjKey: 'I', clue: 'all morning / ongoing activity with visible results' },
                { template: 'The engineers __BLANK__ on this bridge design for years.', verb: 'work', subjKey: 'they', clue: 'for years / repeated or continuous action up to now' },
                { template: 'He looks exhausted — he __BLANK__ non-stop since six in the morning.', verb: 'run', subjKey: 'he', clue: 'since + visible result now' },
            ],
            past_perfect: [
                { template: 'By the time the ambulance arrived, the patient __BLANK__ consciousness.', verb: 'lose', subjKey: 'he', clue: 'by the time + earlier past event' },
                { template: 'Maya realised she __BLANK__ her passport at home after reaching the airport.', verb: 'leave', subjKey: 'he', clue: 'realised + earlier mistake before main past event' },
                { template: 'The thief __BLANK__ before the police even reached the scene.', verb: 'escape', subjKey: 'he', clue: 'sequence — first event before another past event' },
                { template: 'He was furious because nobody __BLANK__ him about the change of plan.', verb: 'tell', subjKey: 'they', clue: 'because + earlier cause before the main past reaction' },
                { template: 'She felt much calmer once she __BLANK__ to her manager about the problem.', verb: 'speak', subjKey: 'he', clue: 'once + completed action before the main past result' },
            ],
            past_perfect_continuous: [
                { template: 'She was out of breath because she __BLANK__ for over an hour.', verb: 'run', subjKey: 'he', clue: 'because + sustained activity before a past result' },
                { template: 'By the time he retired, Mr Chen __BLANK__ for the same company for forty years.', verb: 'work', subjKey: 'he', clue: 'by the time + long duration before a past point' },
                { template: 'The team were exhausted — they __BLANK__ all night to fix the server.', verb: 'work', subjKey: 'they', clue: 'all night / sustained effort before a past result' },
                { template: 'I __BLANK__ for two hours before the race was cancelled.', verb: 'train', subjKey: 'I', clue: 'for + duration before a past event cancelled it' },
            ],
            future_will: [
                { template: 'I\'m sure Emma __BLANK__ the job — she was easily the strongest candidate.', verb: 'get', subjKey: 'he', clue: 'I\'m sure / prediction based on opinion' },
                { template: 'Don\'t worry — I __BLANK__ the report finished by Thursday, I promise.', verb: 'have', subjKey: 'I', clue: 'promise / spontaneous decision at moment of speaking' },
                { template: 'Scientists predict the global temperature __BLANK__ by two degrees by 2050.', verb: 'rise', subjKey: 'he', clue: 'scientists predict / future prediction' },
                { template: 'If you press that button, the machine __BLANK__ immediately.', verb: 'stop', subjKey: 'he', clue: 'if + conditional result (future)' },
                { template: 'They say it __BLANK__ tomorrow — bring an umbrella.', verb: 'rain', subjKey: 'he', clue: 'prediction about tomorrow' },
            ],
            future_going_to: [
                { template: 'Look at those clouds — it is going to __BLANK__ any minute now.', verb: 'rain', subjKey: 'he', clue: 'look at (evidence visible now → certain near-future event)', goingTo: true },
                { template: 'They\'ve already bought the tickets — they are going to __BLANK__ to Canada next spring.', verb: 'move', subjKey: 'they', clue: 'already decided / prior plan or intention', goingTo: true },
                { template: 'She told me she is going to __BLANK__ her job and start her own business.', verb: 'quit', subjKey: 'he', clue: 'told me / stated intention', goingTo: true },
                { template: 'I have decided — I am going to __BLANK__ medicine at university.', verb: 'study', subjKey: 'I', clue: 'I have decided / firm plan made before now', goingTo: true },
                { template: 'The coach says the team is going to __BLANK__ their tactics next season.', verb: 'change', subjKey: 'he', clue: 'announced plan / stated intention', goingTo: true },
            ],
            future_perfect: [
                { template: 'By the time you wake up tomorrow, I __BLANK__ the whole novel.', verb: 'finish', subjKey: 'I', clue: 'by the time + action complete before a future point' },
                { template: 'Emma __BLANK__ all her exams before the end of June.', verb: 'pass', subjKey: 'he', clue: 'before the end of + completed before future deadline' },
                { template: 'By 2030, scientists predict they __BLANK__ a cure for that disease.', verb: 'find', subjKey: 'they', clue: 'by 2030 / completed action before future point' },
            ],
            future_continuous: [
                { template: 'This time tomorrow, Laura __BLANK__ on a beach in the Maldives.', verb: 'lie', subjKey: 'he', clue: 'this time tomorrow / action in progress at a future moment' },
                { template: 'Don\'t call at noon — the board __BLANK__ its annual meeting then.', verb: 'hold', subjKey: 'he', clue: 'at noon / activity in progress at that future time' },
                { template: 'I __BLANK__ from the office next week, so you can reach me there.', verb: 'work', subjKey: 'I', clue: 'next week / ongoing arrangement at a future time' },
            ]
        };
