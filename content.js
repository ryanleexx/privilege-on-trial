/*
 * Privilege on Trial: all game content lives here.
 * Edit text freely. Logic lives in index.html.
 *
 * Structure
 *   cards:  reusable blocks of prose. Each block is a list of segments.
 *           segment = { text, tag?, join? }
 *             tag:  "HOLDING" | "OBITER" | "COMMENTARY" | "STATUTE"
 *             join: true continues the previous paragraph instead of starting a new one
 *   nodes:  each node has a stage, a question and choices.
 *           choice = { label, type, card: [card ids], rebuttal: [card ids] }
 *             type: "CORRECT" | "ARGUABLE" | "DEAD END" | "VALID ROUTE"
 *             VALID ROUTE: a node may have two or more valid routes instead of one CORRECT.
 *               followUp: { label, card } shows the other route on a second screen.
 *             rebuttal is only used for ARGUABLE choices
 *           sharedCard: [card ids] shown after every pick (correct answer highlighted)
 *   emails: the node order for each playthrough, the verdict, and an optional whatIf node
 *           reached from the verdict screen (W key). Optional nodes are not scored.
 *
 * After editing, run:  node build-backup.js  then  node check-content.js
 */
const GAME = {
  meta: {
    title: `Privilege on Trial`,
    subtitle: `s128(2) of the Evidence Act 1893`
  },

  ui: {
    playFirst: `Play: First Email`,
    playSecond: `Play: Second Email`,
    debrief: `Debrief`,
    home: `Home`,
    next: `Next`,
    back: `Back`,
    tryAgain: `Try again`,
    restart: `Restart`,
    seeRebuttal: `See the rebuttal`,
    interstitial: `This is the other side’s best point. See the rebuttal`,
    rebuttal: `Rebuttal`,
    voteNow: `Vote now`,
    facts: `Facts`,
    answer: `Answer`,
    score: `Score`,
    scoreSuffix: `nodes correct on the first vote`,
    timer: `Vote timer`,
    theme: `Theme`,
    on: `On`,
    off: `Off`,
    dark: `Dark`,
    light: `Light`,
    showScore: `Show score`,
    revealAll: `Reveal all`,
    route: `Valid route`,
    routesConverge: `Both routes to s128(2) reach the same result.`,
    whatIf: `What if`,
    backToVerdict: `Back to verdict`,
    skip: `Skip to court`,
    narrator: `The facts`,
    from: `From`,
    to: `To`,
    subject: `Subject`
  },

  // Rendered in italics wherever they appear (case names, textbook short names, Latin).
  italicTerms: [
    `Gelatissimo`, `Skandinaviska`, `Balabel`, `Cox and Railton`, `Crescent Farm`,
    `O’Rourke v Darbishire`, `O’Rourke`, `JSC`, `Kuwait Airways (No 6)`,
    `Barclays Bank v Eustice`, `Gamlen`, `ARX`,
    `Pinsler`, `Thanki`, `Liew`,
    `prima facie`, `obiter`, `bona fide`, `ratio`
  ],

  stages: [`Preliminary`, `Privilege`, `Purpose`, `Analogy`, `Core or Penumbra`, `Proof`, `Verdict`],

  // The cast. Portraits are drawn in index.html. Edit names and roles here.
  characters: {
    judge: { name: `The Court`, role: `` },
    X: { name: `X`, role: `Defendant` },
    Z: { name: `Z`, role: `X’s lawyer` },
    Y: { name: `Y`, role: `Claimant` }
  },

  // Story scenes played before Node 0. Text is taken word for word from Seminar Question 3.
  // beat = { speaker, text }  or  { speaker, email: { to, subject }, lines: [...] }
  //   speaker: "narrator" or a key from characters. focus: which character to spotlight during narration.
  scenes: {
    first: {
      cast: [`X`, `Z`, `Y`],
      beats: [
        { speaker: `narrator`, focus: `Y`, text: `Y sues X for failure to pay the outstanding sum of $15,000 out of the $85,000 agreed price for various renovation works Y carried out at X’s house.` },
        { speaker: `narrator`, focus: `Z`, text: `X engages Z, a practising lawyer, to represent him in court. While preparing for the litigation, X sends Z the following two emails.` },
        { speaker: `narrator`, focus: `X`, text: `In the first email (the ‘First Email’), X informs Z that Y had agreed to give X a discount of $15,000 for the renovation works carried out at his house. X claims that the $70,000 that he had already paid Y constitutes full payment for the renovation works.` },
        { speaker: `narrator`, focus: `X`, text: `X also states that Y had agreed to this in a written agreement signed sometime in March 2025, but he can no longer find the signed agreement.` },
        { speaker: `X`, email: { to: `Z`, subject: `First Email` }, lines: [`‘prepare a new copy of the written agreement dated 10 March 2025’`, `‘settle the rest’`] },
        { speaker: `narrator`, focus: `Z`, text: `Z refuses to do so.` },
        { speaker: `narrator`, focus: `Y`, text: `Y seeks disclosure of the First Email and the Second Email.` }
      ]
    },
    second: {
      cast: [`X`, `Z`, `Y`],
      beats: [
        { speaker: `narrator`, focus: `Y`, text: `Y sues X for failure to pay the outstanding sum of $15,000 out of the $85,000 agreed price for various renovation works Y carried out at X’s house.` },
        { speaker: `narrator`, focus: `Z`, text: `X engages Z, a practising lawyer, to represent him in court. While preparing for the litigation, X sends Z the following two emails.` },
        { speaker: `narrator`, focus: `X`, text: `In the second email (the ‘Second Email’), X sends Z a draft social media post and asks if he can be sued for defamation if he posts it. The draft post states that Y used ‘low-quality’ materials for the renovation of X’s house.` },
        { speaker: `X`, email: { to: `Z`, subject: `Second Email` }, lines: [`‘having been a victim of Y’s lousy renovation services’`, `‘spread awareness to other homeowners about Y’s unacceptable actions’`, `‘let Y know that [X] is not someone to mess with’`] },
        { speaker: `narrator`, focus: `Z`, text: `Z reviews the draft post and amends certain potentially defamatory portions before telling X that there are ‘no other issues’.` },
        { speaker: `narrator`, focus: `X`, text: `X then posts the amended draft on his social media account.` },
        { speaker: `narrator`, focus: `Y`, text: `Y seeks disclosure of the First Email and the Second Email.` }
      ]
    }
  },

  facts: {
    common: `Y is suing X for $15,000 over a renovation. A discount is disputed. Z is X’s lawyer.`,
    first: `X says Y agreed to a $15,000 discount in a written agreement signed sometime in March 2025, which he can no longer find. X asks Z to “prepare a new copy of the written agreement dated 10 March 2025” and says he will “settle the rest”. Z refuses to do so.`,
    second: `X asks Z for advice on whether he could be sued for defamation over a draft social media post, written to “spread awareness” and to “let Y know that [X] is not someone to mess with”. Z amends the post to remove the potentially defamatory parts and advises that there are “no other issues”. X publishes the amended post.`,
    question: `Do the First Email and Second Email fall within s128(2) EA?`
  },

  cards: {
    // ---------- Node 0 ----------
    n0_a: [
      { text: `The Court of Appeal has explained that “s128 applies only to an advocate or solicitor, but not to the client” (Skandinaviska at [32]).`, tag: `HOLDING` },
      { text: `But the High Court stated that “both legal advice privilege and litigation privilege under s128 and s131 of the EA are subject to the fraud exception” (Gelatissimo at [36]), reasoning that “it would be anomalous if the exceptions to one were much broader than the other” (at [67]).`, tag: `OBITER` },
      { text: `Why it fails: the gap in s131 has been bridged. Try again.` }
    ],
    n0_gel: [
      { text: `The High Court stated that “both legal advice privilege and litigation privilege under s128 and s131 of the EA are subject to the fraud exception” (Gelatissimo at [36]), reasoning that “it would be anomalous if the exceptions to one were much broader than the other” (at [67]).`, tag: `OBITER` },
      { text: `These statements were obiter, since the court ultimately “found that the defendant had failed to make out a prima facie case of fraud” (at [85]), although they carry considerable persuasive weight given that Gelatissimo remains the leading Singapore decision on s128(2).` }
    ],
    n0_b: [
      { text: `Liew observes that “the court in Gelatissimo appears to have wrongly considered that the Evidence Act was the source of litigation privilege” (Liew at [7.45]).`, tag: `COMMENTARY` },
      { text: `Pinsler identifies “a systemic difficulty in applying the exceptions in s128(2)(a) and (b), which concern legal advice privilege as provided by s128(1), to s131” (Pinsler at [14.115A]).`, tag: `COMMENTARY` }
    ],
    n0_c: [
      { text: `Pinsler suggests that “it would be possible to apply the common law exceptions to litigation privilege (which would include the exceptions in s128(2)(a) and (b) of the EA) on the basis that the common law may be relied on to supplement the provisions in the EA in the absence of inconsistency” (at [14.115A]).`, tag: `COMMENTARY` },
      { text: `Our position: follow Gelatissimo on two matters (the exception reaches the client, and criminal and civil fraud lie at its core) but not on its penumbral balancing exercise.` }
    ],

    // ---------- Shared LAP and LP tests ----------
    lap_lp_tests: [
      { text: `LAP: “whether the communication or other document was made confidentially for the purposes of legal advice”, and “[t]hose purposes have to be construed broadly” (Balabel, endorsed in Skandinaviska at [47]).`, tag: `HOLDING` },
      { text: `LP requires a “reasonable prospect” of litigation (Skandinaviska at [71] and [73]) and that “the dominant purpose for which legal advice had been sought and obtained was for anticipation or contemplation of litigation” (at [75]-[76]).`, tag: `HOLDING` }
    ],

    // ---------- First Email ----------
    fe1_app: [
      { text: `Application: a confidential communication from X to his lawyer concerning the substance of his defence to a claim that had already been commenced. The court will likely find both LAP and LP.` }
    ],
    fe2_a: [
      { text: `If so, the request would resemble “a bona fide communication which seeks advice on what course of action to take” (Pinsler at [14.070]).`, tag: `COMMENTARY` }
    ],
    fe2_a_rebuttal: [
      { text: `That reading is difficult to sustain. X supplied a specific date and described the document as a “copy”. Even if the discount had genuinely been agreed, a document made “with the intention of causing it to be believed that such document … was made … at a time at which he knows that it was not made” may still constitute a false document under s464(1)(a) of the Penal Code 1871.`, tag: `STATUTE` }
    ],
    fe2_b: [
      { text: `X asked for a “new copy of the written agreement”, specified the date of “10 March 2025” even though he could recall only that the agreement had been signed “sometime in March 2025”, and added that he would “settle the rest”.` },
      { text: `Under s464(1)(a) of the Penal Code 1871, a person makes a false document if he “dishonestly or fraudulently […] makes, signs, seals or executes a document […] with the intention of causing it to be believed that such document […] was made […] at a time at which he knows that it was not made, signed, sealed, executed or affixed”.`, tag: `STATUTE` },
      { text: `Under s463, “[w]hoever makes any false document […] to support any claim or title […] commits forgery”.`, tag: `STATUTE` }
    ],
    fe2_c: [
      { text: `Nothing in the email asks for advice. X asked Z to prepare a document and said he would “settle the rest”.` }
    ],
    fe3_a: [
      { text: `Illustration (b): a client says, “I wish to obtain possession of property by the use of a forged deed on which I request you to sue”, and “[t]his communication being made in furtherance of a criminal purpose is not protected from disclosure”.`, tag: `STATUTE` },
      { text: `Cox and Railton: a memorandum purporting to record the dissolution of a partnership “had been falsely antedated”, and the court held that “the evidence of the solicitor had been properly admitted” (Thanki at [4.41]).`, tag: `HOLDING` },
      { text: `X’s purpose is closely analogous, save that the forged document was intended to defeat a claim rather than to advance one.` }
    ],
    crescent_farm: [
      { text: `Crescent Farm protects advice on liability: “parties must be at liberty to take advice as to the ambit of their contractual obligations and liabilities in tort and what liability they will incur whether in contract or tort without thereby in every case losing professional privilege” (at 565, cited in Thanki at [4.49]).`, tag: `HOLDING` }
    ],
    fe3_b_app: [
      { text: `X did not ask about his liability. He asked Z to make a document.` }
    ],
    orourke: [
      { text: `“[t]o consult a solicitor about an intended course of action, in order to be advised whether it is legitimate or not … is a very different thing from consulting him in order to learn how to plan, execute, or stifle an actual fraud” (at 613, cited in Thanki at [4.69]).`, tag: `OBITER` }
    ],
    fe3_c_app: [
      { text: `X falls on the wrong side of this line.` }
    ],
    fe3_d: [
      { text: `X’s strongest response: privilege “is not prevented from attaching merely because the solicitor is engaged to conduct litigation by putting forward an account of events which the client knows to be untrue” (JSC at [71]).`, tag: `HOLDING` }
    ],
    fe3_d_rebuttal: [
      { text: `In Kuwait Airways (No 6), the court at first instance observed that “[i]t will of course not be enough that a solicitor has simply been the conduit of untruthful evidence”, but that “it cannot be part of the professional duty of a solicitor to assist in the presentation of a bogus defence particularly with the assistance of manufactured documents” (JSC at [90]).` },
      { text: `In Cox and Railton, the court stated that “[i]f his criminal object is avowed, the client does not consult his adviser professionally, because it cannot be the solicitor’s business to further any criminal object” (JSC at [81]).` },
      { text: `X openly avowed his object to Z, so the First Email was likely not a professional consultation at all.` }
    ],
    fe4_a: [
      { text: `“[a]t its core, there is no doubt that fraud includes all forms of criminal and civil fraud”, and “[n]o balancing exercise need to be conducted in such circumstances” (Gelatissimo at [63]).`, tag: `OBITER` }
    ],
    fe4_b: [
      { text: `Even in the penumbra, the factors likely favour disclosure: Culpability “remains an important factor, and the dishonest making of a false statement is likely to weigh against him” (Gelatissimo at [72]).`, tag: `OBITER` },
      { text: `If X’s scheme succeeded, Y would be left like the creditors in Barclays Bank v Eustice, “deprived … of money which [he] would otherwise be legally entitled to” (at [73]).`, tag: `OBITER` },
      { text: `The only factor favouring X: both LAP and LP are engaged, so “the policy of upholding privilege is likely to be stronger” (at [74]).`, tag: `OBITER` },
      { text: `This is unlikely to outweigh the dishonesty of X’s purpose.` }
    ],
    fe5_proof: [
      { text: `“a mere allegation is not sufficient and there has to be at least some prima facie evidence” (Gelatissimo at [79]).`, tag: `OBITER` },
      { text: `Where the alleged fraud is itself in issue, “a strong prima facie case” may be required, although “a lower standard of proof would be required in cases where the alleged fraud is closest in nature to the traditional fraud cases” (at [80]).`, tag: `OBITER` },
      { text: `Our submission: the lower threshold should suffice, since the improper purpose lies in X’s request to manufacture a document, which is distinct from the merits of the disputed discount.` },
      { text: `Critique: the lower standard “seems to conflate two separate issues: the type of conduct caught by the crime-fraud exception, and the standard of proof required to engage it” (Liew at [7.87]).`, tag: `COMMENTARY` },
      { text: `The practical route: a party “relying solely on circumstantial evidence and his own affidavits” may struggle (Gelatissimo at [81]).`, tag: `OBITER` },
      { text: `Under s164(3), “[t]he court, if it sees fit, may inspect the document”`, tag: `STATUTE` },
      { text: `, and inspection is appropriate where “the judge has a real doubt about the claim of the party seeking to resist discovery on the ground of legal professional privilege” (Skandinaviska at [104]).`, tag: `OBITER`, join: true }
    ],

    // ---------- Second Email ----------
    se1_app: [
      { text: `X consulted Z in his professional capacity on his potential liability in defamation. It is likely immaterial that the query fell outside Z’s retainer, since privilege depends “on whether he has been consulted in his professional capacity so that the communications are referrable to their relationship of advocate and solicitor and client” (Pinsler at [14.013]).`, tag: `COMMENTARY` },
      { text: `LP is unlikely: any defamation claim depended on X’s own future decision to publish, so the prospect of litigation amounted to no more than “a general apprehension of future litigation” (Skandinaviska at [72]).`, tag: `HOLDING` }
    ],
    se2_shared: [
      { text: `The Indian legislature “preferred the word ‘illegal’ to ‘criminal’”, and it “may be appropriate to construe ‘illegal’ as including any conduct (whether criminal or non-criminal) which would make it unconscionable to uphold the privilege”, but “uncertainty remains as to how far, if at all, para (a) extends beyond criminal conduct” (Pinsler at [14.057]).`, tag: `COMMENTARY` },
      { text: `s2(2): “[a]ll rules of evidence not contained in any written law, so far as such rules are inconsistent with any of the provisions of this Act, are repealed”.`, tag: `STATUTE` },
      { text: `Where an express provision governs, the common law “can play one and only one role, which is to help in the interpretation of the provision” (Tan at [44]-[45]).`, tag: `COMMENTARY` },
      { text: `Why it does not matter: even if a tortious purpose can be “illegal”, the Second Email was likely not made “in furtherance of” it. Move on.` }
    ],
    se3_a_app: [
      { text: `X asked whether his post was lawful, and Z removed the potentially defamatory portions before X posted it. X falls on the protected side of the line.` }
    ],
    se3_b: [
      { text: `Y’s strongest argument rests on X’s stated wish to “let Y know that [X] is not someone to mess with”. In Barclays Bank v Eustice there was “no obviously dishonest motive” (Thanki at [4.53]).`, tag: `COMMENTARY` }
    ],
    se3_b_rebuttal: [
      { text: `Unlike the creditors in Barclays Bank v Eustice, Y would not be “deprived … of money which [he] would otherwise be legally entitled to” (Gelatissimo at [73]).`, tag: `OBITER` },
      { text: `X’s post does not affect Y’s claim for $15,000.` }
    ],
    se3_c: [
      { text: `English law asks whether “the iniquity puts the advice or conduct outside the normal scope of such professional engagement, or renders it an abuse of the relationship which properly falls within the ordinary course of such an engagement” (JSC at [93]).`, tag: `HOLDING` }
    ],
    se3_c_rebuttal: [
      { text: `The court in Gelatissimo held that the likelihood that discovered documents would be released to the press “by itself did not amount to an abuse of process” (at [84]).`, tag: `HOLDING` },
      { text: `Thanki accepts that the abuse test “is not an easy test to apply in practice” (at [4.55]).`, tag: `COMMENTARY` }
    ],
    se3_d: [
      { text: `Cox and Railton concerned a document that “had been falsely antedated” (Thanki at [4.41]). X asked whether his post was lawful. There was no dishonesty and no deception.`, tag: `HOLDING` }
    ],
    se4_a: [
      { text: `X’s purpose was not dishonest, so it does not fall within the core of criminal and civil fraud recognised in Gelatissimo (at [63]). Any argument for disclosure must rest on the penumbra.` }
    ],
    se4_b: [
      { text: `Culpability, which “remains an important factor” (Gelatissimo at [72]), is low, since X asked whether his post was lawful and published only the amended draft.`, tag: `OBITER` },
      { text: `Y would suffer no loss “akin to the loss which victims of criminal or civil fraud suffer” (at [72]).`, tag: `OBITER` },
      { text: `Against X: only LAP is engaged, and “the policy of upholding privilege is likely to be stronger when the privilege sought to be protected consists of both litigation and legal advice privilege” (at [74]).`, tag: `OBITER` },
      { text: `But “it is not obvious how and why the operation of the crime-fraud exception should differ according to whether a communication is protected by legal advice privilege, litigation privilege, or both” (Liew at [7.86]).`, tag: `COMMENTARY` }
    ],

    fe_refusal: [
      { text: `Pinsler notes that s128(2)(a) “is concerned with the client’s intention in making the communication”, such that the lawyer’s ignorance of that intention is “immaterial” (at [14.056]).`, tag: `COMMENTARY` }
    ],
    whatif_pen: [
      { text: `Beyond that core lies a penumbra, in which the court considers “the public policy considerations that militate against the purpose for which legal advice was given, and whether that purpose is sufficiently iniquitous for it to be classified as fraud under s128(2)” (at [65]).`, tag: `OBITER` }
    ],
    memo_30: [
      { text: `Whereas the First Email can be resolved by direct analogy with Illustration (b) and Cox and Railton, the outcome of the Second Email, under either the Gelatissimo penumbra or the English abuse test, turns on how the court characterises X’s motive.` },
      { text: `It is submitted that a client therefore cannot know in advance whether candidly disclosing an unattractive motive to his lawyer will cost him his privilege, which is precisely the difficulty that Thanki identifies (at [4.62]).` }
    ],
    se_caveat: [
      { text: `Caveat: a court applying the broader English abuse test could reach a different result if the evidence showed that X’s dominant purpose was to pressure Y into abandoning his claim.` }
    ],

    // ---------- Debrief ----------
    db_1: [
      { text: `A client’s purpose is closely analogous to conduct held to be caught where (i) the purpose is dishonest, and (ii) the client seeks to use the lawyer’s services as the means of carrying it out, rather than to learn whether a course of action is lawful.` },
      { text: `“[T]he principle is an exceptional one and the court will not lightly deprive a party of the protection of legal professional privilege” (Thanki at [4.46]).`, tag: `COMMENTARY` },
      { text: `Supporting: Gamlen, the court “must in every case … be satisfied that what is prima facie proved really is dishonest, and not merely disreputable or a failure to maintain good ethical standards” (Liew at [7.66] and [7.70]).`, tag: `OBITER` }
    ],
    db_2: [
      { text: `The court “interpreted the word ‘fraud’ in the general context of both paras (a) and (b) of s128(2) without examining the specific terminology of the provisions” (Pinsler at [14.066]), and the core and penumbra division is “both complex and somewhat artificial” (at [14.068]).`, tag: `COMMENTARY` }
    ],
    db_3: [
      { text: `It should be “relatively straightforward to determine whether a client has a dishonest or fraudulent intention”, but it “will be much more difficult to determine whether a client is seeking to engage in conduct which a court may regard as iniquitous” (Thanki at [4.62]).`, tag: `COMMENTARY` },
      { text: `On fraud-like loss, there “appears to be no authority in support of this novel approach”, since “like fraud, all civil wrongs if successful will cause their victims pecuniary loss” (Liew at [7.77]).`, tag: `COMMENTARY` }
    ],
    db_4: [
      { text: `When Parliament enacted s128A(2) in 2012, it reproduced s128(2) without referring to any wider iniquity exception (ARX at [39]).` },
      { text: `If the exception is to extend to iniquity falling short of crime and fraud, it is for Parliament to say so expressly.` }
    ]
  },

  nodes: {
    n0: {
      stage: `Preliminary`,
      question: `Y wants disclosure from X, the client, not from Z. Can s128(2) apply?`,
      choices: [
        { label: `No. s128 only binds the lawyer, so X keeps privilege.`, type: `DEAD END`, card: [`n0_a`] },
        { label: `Yes, because Gelatissimo says so.`, type: `VALID ROUTE`, card: [`n0_gel`], followUp: { label: `The backup route`, card: [`n0_b`, `n0_c`] } },
        { label: `Yes, through the common law supplementing s131, with s128(2) defining the content.`, type: `VALID ROUTE`, card: [`n0_c`], followUp: { label: `The current-law route`, card: [`n0_gel`] } }
      ]
    },

    fe1: {
      stage: `Privilege`,
      question: `Which privilege does the First Email attract?`,
      sharedCard: [`lap_lp_tests`, `fe1_app`],
      choices: [
        { label: `LAP only`, type: `DEAD END` },
        { label: `LP only`, type: `DEAD END` },
        { label: `Both LAP and LP`, type: `CORRECT` },
        { label: `Neither`, type: `DEAD END` }
      ]
    },
    fe2: {
      stage: `Purpose`,
      question: `On its natural reading, what did X want Z to produce?`,
      choices: [
        { label: `An honest reconstruction of a lost agreement, openly labelled as such.`, type: `ARGUABLE`, card: [`fe2_a`], rebuttal: [`fe2_a_rebuttal`] },
        { label: `A document to be presented as the signed agreement itself.`, type: `CORRECT`, card: [`fe2_b`] },
        // Facts-only card: it quotes the email, not an authority. Exempted in check-content.js.
        { label: `Advice on how to defend Y’s claim.`, type: `DEAD END`, card: [`fe2_c`], factsOnly: true }
      ]
    },
    fe2r: {
      stage: `Purpose`,
      question: `Z refused to prepare the document. Does that take the First Email outside s128(2)(a)?`,
      sharedCard: [`fe_refusal`],
      choices: [
        { label: `Yes. Z refused, so nothing was done in furtherance of X’s purpose.`, type: `DEAD END` },
        { label: `No. s128(2)(a) looks at X’s intention in making the communication.`, type: `CORRECT` }
      ]
    },
    fe3: {
      stage: `Analogy`,
      question: `Which case or illustration does the First Email most resemble?`,
      choices: [
        { label: `Illustration (b) to s128 and Cox and Railton`, type: `CORRECT`, card: [`fe3_a`] },
        { label: `Crescent Farm`, type: `DEAD END`, card: [`crescent_farm`, `fe3_b_app`] },
        { label: `O’Rourke v Darbishire`, type: `DEAD END`, card: [`orourke`, `fe3_c_app`] },
        { label: `JSC at [71]: a client may give his lawyer an untrue account`, type: `ARGUABLE`, card: [`fe3_d`], rebuttal: [`fe3_d_rebuttal`] }
      ]
    },
    fe4: {
      stage: `Core or Penumbra`,
      question: `Applying Gelatissimo as the law currently stands, does the court need to run its balancing exercise?`,
      choices: [
        { label: `No. This is core fraud.`, type: `CORRECT`, card: [`fe4_a`] },
        { label: `Yes. It is in the penumbra.`, type: `ARGUABLE`, card: [`fe4_b`], rebuttal: [`fe4_a`] }
      ]
    },
    fe5: {
      stage: `Proof`,
      question: `Y does not have the First Email. What must Y show, and how?`,
      sharedCard: [`fe5_proof`],
      choices: [
        { label: `Proof beyond reasonable doubt.`, type: `DEAD END` },
        { label: `A mere allegation is enough.`, type: `DEAD END` },
        { label: `At least some prima facie evidence, possibly a strong prima facie case.`, type: `CORRECT` }
      ]
    },

    se1: {
      stage: `Privilege`,
      question: `Which privilege does the Second Email attract?`,
      sharedCard: [`lap_lp_tests`, `se1_app`],
      choices: [
        { label: `LAP only`, type: `CORRECT` },
        { label: `LP only`, type: `DEAD END` },
        { label: `Both LAP and LP`, type: `ARGUABLE` },
        { label: `Neither`, type: `DEAD END` }
      ]
    },
    se2: {
      stage: `Purpose`,
      question: `Can defamation be an “illegal purpose” under s128(2)(a)?`,
      sharedCard: [`se2_shared`],
      choices: [
        { label: `No, “illegal” means criminal only.`, type: `ARGUABLE` },
        { label: `Yes, “illegal” covers all civil wrongs.`, type: `ARGUABLE` },
        { label: `Uncertain, and it does not matter here.`, type: `CORRECT` }
      ]
    },
    se3: {
      stage: `Analogy`,
      question: `Which case or illustration does the Second Email most resemble?`,
      choices: [
        { label: `O’Rourke v Darbishire and Crescent Farm`, type: `CORRECT`, card: [`orourke`, `crescent_farm`, `se3_a_app`] },
        { label: `Barclays Bank v Eustice`, type: `ARGUABLE`, card: [`se3_b`], rebuttal: [`se3_b_rebuttal`] },
        { label: `JSC abuse test`, type: `ARGUABLE`, card: [`se3_c`], rebuttal: [`se3_c_rebuttal`] },
        { label: `Cox and Railton`, type: `DEAD END`, card: [`se3_d`] }
      ]
    },
    se4: {
      stage: `Core or Penumbra`,
      question: `Applying Gelatissimo as the law currently stands, does the court need to run its balancing exercise?`,
      choices: [
        { label: `Core fraud, no balancing.`, type: `DEAD END`, card: [`se4_a`] },
        { label: `Penumbra. Apply the Gelatissimo factors.`, type: `CORRECT`, card: [`se4_b`] }
      ]
    },
    // Optional fork from the Second Email verdict screen. Not scored.
    se_whatif: {
      stage: `Verdict`,
      optional: true,
      question: `What if the evidence showed that X’s dominant purpose was to pressure Y into abandoning his claim?`,
      choices: [
        { label: `The Gelatissimo penumbra`, type: `VALID ROUTE`, card: [`whatif_pen`, `memo_30`] },
        { label: `The broader English abuse test`, type: `VALID ROUTE`, card: [`se3_c`, `se_caveat`, `memo_30`] }
      ]
    }
  },

  emails: {
    first: {
      title: `First Email`,
      nodes: [`n0`, `fe1`, `fe2`, `fe2r`, `fe3`, `fe4`, `fe5`],
      verdict: {
        title: `Verdict: First Email`,
        headline: `Likely within s128(2)(a). Not privileged.`,
        body: [
          `The court will likely find that the First Email falls within s128(2)(a), subject to Y establishing at least a prima facie case that it was made in furtherance of X’s fraudulent purpose.`
        ]
      }
    },
    second: {
      title: `Second Email`,
      nodes: [`n0`, `se1`, `se2`, `se3`, `se4`],
      whatIf: `se_whatif`,
      verdict: {
        title: `Verdict: Second Email`,
        headline: `Likely outside s128(2). Remains privileged.`,
        body: [
          `The court will likely find that the Second Email falls outside s128(2) and remains privileged.`,
          `Caveat: a court applying the broader English abuse test could reach a different result if the evidence showed that X’s dominant purpose was to pressure Y into abandoning his claim.`
        ]
      }
    }
  },

  debrief: {
    title: `Why the two emails end differently`,
    panels: [
      { title: `Our test`, card: [`db_1`] },
      { title: `The text problem`, card: [`db_2`] },
      { title: `The certainty problem`, card: [`db_3`] },
      { title: `Reform`, card: [`db_4`] }
    ],
    finalLine: `First Email: core, resolved by analogy. Second Email: penumbra, turns on motive. That gap is the problem.`
  }
};

if (typeof module !== `undefined`) module.exports = GAME;
