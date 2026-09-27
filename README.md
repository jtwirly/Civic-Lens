# Civic Lens
Civic Lens connects the dots between legislation and the people it affects: understand the bill, see what it means for you, and engage the government responsible for it.

Prototype: https://remix-civic-lens-bill-to-me-5612.ai.studio 

<div style="position:relative;width:100%;height:0;padding-bottom:56.25%;"><iframe allow="clipboard-write" allowfullscreen style="position:absolute; width: 100%; height: 100%;border: solid 1px #333;" src="https://www.beautiful.ai/embed/-P2ZDI5JHJseTshkutLh?utm_source=beautiful_player&utm_medium=embed&utm_campaign=-P2YY6mJE38lVTn9ngzO"></iframe><a href="https://www.beautiful.ai/embed/-P2ZDI5JHJseTshkutLh?utm_source=beautiful_player&utm_medium=embed&utm_campaign=-P2YY6mJE38lVTn9ngzO">View Civic Lens: Infrastructure for Civic Participation on Beautiful.ai</a></div>

## Inspiration

Government makes decisions through documents that are often extremely difficult for the people affected by them to understand. Federal legislation can contain hundreds of pages of amendments, cross-references, definitions, and statutory language that assumes substantial legal knowledge.

For a citizen, small-business owner, or community advocate, that creates three barriers:

- **Understanding:** What does this bill actually change?
- **Personal relevance:** Does it affect me, my family, my organization, or my business?
- **Participation:** If I have a concern, where is the bill in the legislative process, who represents me, and how can I communicate that concern to government?

We wanted to build something that does more than display government information. **Civic Lens closes the loop between legislation and civic participation:** it turns statutory text into plain-language explanations, connects those provisions to a person's specific concern, grounds the explanation in the underlying parliamentary text, and helps the person take the next step with government.

The goal is not to tell citizens what position to take. It is to make the information and procedures of government understandable enough that people can participate in them.

## What it does

**Civic Lens** turns complex Canadian legislation and parliamentary information into something people can understand, investigate, and act on through a connected civic workflow.

### 1. Understand the legislation

**Plain-Language Legal Deconstruction:**  
The system translates complex Canadian legislation into accessible explanations while preserving the underlying legal structure.

**Before vs. After:**  
For amending legislation, Civic Lens shows how relevant provisions change from the existing statutory framework to the proposed framework, making legislative amendments easier to understand.

**Source Citations:**  
Substantive explanations are linked to specific statutory provisions. A citation can be opened to show the underlying parliamentary text rather than asking the user to simply trust an AI-generated explanation.

### 2. Connect legislation to the broader parliamentary record

Civic Lens integrates information from **Parliament of Canada's legislative records, OpenParliament, and A2AJ's legal research infrastructure**.

This lets the project connect different layers of Canadian public information:

**Legislation → Parliamentary activity → Legal decisions → Civic action**

Rather than treating a bill as an isolated document, Civic Lens can place it within the broader ecosystem of parliamentary debate, representatives, committees, and emerging legal issues.

### 3. Ask: “What does this mean for me?”

**Citizen Concern Tracer:**  
A person can describe their situation or question in ordinary language—for example:

> “I run a five-person web agency. Would this bill create new obligations for us if we deploy AI tools?”

Civic Lens identifies the provisions relevant to that concern and explains how they relate to the person's situation, including relevant obligations, protections, and unresolved policy questions.

### 4. Connect people back to government

**Riding & MP Matcher:**  
A Canadian postal code can be used to identify the relevant federal electoral district and Member of Parliament, including available parliamentary contact and committee information.

**Parliamentary Letter & Brief Generator:**  
Civic Lens can turn a citizen's concern into a concise constituent letter or a structured parliamentary committee brief, which the user can review and copy for submission.

This creates a direct civic pathway:

**Legislation → Understanding → Personal relevance → Government**

### 5. Explore beyond the built-in examples

**Custom Bill & Regulatory Ingestion:**  
Users can provide other legislative or policy text and run it through the same structured analysis workflow.

---

## How we built it

We built an end-to-end civic-tech architecture that combines **legislative parsing, parliamentary data, legal research data, source-grounded generative AI, and civic-action infrastructure.**

The tech stack is: React · TypeScript · Gemini · Google GenAI SDK

### Legislative Document Ingestion

Legislative text is converted into structured representations of Acts, Parts, Sections, Subsections, and other statutory elements rather than being treated as one large block of text.

The system works with Canadian parliamentary and legislative sources, including **Parliament of Canada records and OpenParliament**, to connect legislative text with the surrounding parliamentary process.

### Legal Research Integration

Civic Lens also integrates with **A2AJ**, allowing the legislative analysis to connect with Canadian legal research and case-law information.

This creates an important bridge between:

**What Parliament is proposing → What Parliament is debating → What courts have considered**

### Statutory Delta & Entity Graph

Canadian bills frequently amend existing legislation through formulas such as:

> “Subsection 14(1) of the Act is replaced by the following...”

Our system parses these amendment instructions and constructs relationships between provisions so that relevant **before-and-after** changes can be surfaced.

### Source-Grounded AI

We use the Google GenAI SDK and Gemini models to generate accessible explanations from the structured legislative data.

The model is constrained by structured output requirements: substantive generated claims must be associated with an exact quotation and statutory clause anchor. If an explanation cannot be grounded in the available source material, the system does not treat it as a verified statutory claim.

This was an important design decision: **AI handles language transformation and reasoning over structured information; the underlying government and legal sources remain the source of truth.**

### Civic Action & Parliamentary Mapping

We built mappings between Canadian federal electoral districts, postal-code prefixes, Members of Parliament, and parliamentary committees to connect legislative information to the relevant democratic institutions.

---

## Challenges we ran into

### Making AI legally traceable
A generic LLM can produce plausible-sounding but incorrect legal citations. In a civic application, that is particularly dangerous because users may rely on an explanation when making decisions or communicating with government.
We addressed this by constraining the synthesis process to our structured legislative representation and requiring generated substantive claims to carry source anchors.

### Reconstructing legislative amendments
Canadian legislation often describes changes as instructions to modify another statute rather than presenting the resulting law as a continuous narrative.
Understanding a provision therefore requires more than summarizing the bill. We had to reason about the relationship between the existing provision and the proposed amendment, which led us to model legislative changes more like a version-control diff than a conventional document summary.

### Keeping civic participation non-partisan
We wanted Civic Lens to make participation easier without telling users what political position they should adopt.
For contested provisions, the system therefore focuses on presenting the relevant arguments, evidence, and parliamentary debate rather than assigning a political conclusion to the user.

## Accomplishments we're proud of

### We connected multiple layers of Canada's civic information ecosystem

Civic Lens brings together information that normally lives in separate systems:

**Legislation + parliamentary activity + legal research + representatives + civic action**

By integrating Parliament, OpenParliament, and A2AJ alongside our own legislative parsing and civic-action layers, we can move beyond a simple bill summarizer toward a connected civic research and participation tool.

### We built a complete people-to-government workflow

Rather than stopping at “summarize this bill,” Civic Lens connects:

**Raw legislation → Parliamentary context → Plain-language explanation → Personal concern → Legal context → Representative → Civic communication**

That is the core civic interaction we set out to build.

### We made AI explanations traceable

Our system is designed so that users can move from an explanation back to the underlying legislative provision instead of treating an AI response as an unexplained authority.

### We designed for trust

The interface deliberately avoids common AI-product patterns that can make generated information feel authoritative without making its provenance clear. Source text, statutory structure, and the distinction between explanation and underlying law are central to the experience.

## What we learned

### In civic technology, provenance matters

Our biggest lesson was that making AI more creative is not necessarily the goal. For legislation, **traceability can be more valuable than fluency**. Users need to be able to see where an explanation came from.

### The barrier to participation is often procedural friction

People may care about a government decision but still not know where to start. Connecting a personal concern to a specific provision, representative, committee, or communication format can remove several procedural barriers at once.

### Legislative text benefits from a “diff” mental model

Software developers routinely understand change through diffs. Applying a similar concept to legislation makes the structure of amendments easier to reason about than presenting hundreds of pages as a single document.

### AI works better when it is given a constrained job

Instead of asking an LLM to “understand Canadian law,” we separated the problem into structured document parsing, legislative comparison, source retrieval, and language generation. This made the AI component more controllable and gave us clearer failure modes.

## What's next for Civic Lens

### Track what happens after citizens participate

A future **“What Happened to My Feedback?”** feature would follow committee reports, amendments, and parliamentary debate to show citizens what happened to issues they raised.

### Expand beyond Parliament

The same architecture could support provincial legislation, municipal bylaws, and other public decision-making processes, particularly in areas such as housing, zoning, transportation, and environmental regulation.

### Full bilingual federal support

We would extend the legislative ingestion and comparison pipeline to support English/French statutory alignment throughout the federal workflow.

### Open Civic Infrastructure

The underlying legislative parsing and source-grounding components could eventually become an open API for journalists, legal clinics, civil-society organizations, researchers, and other civic-technology developers.

## Images

<img width="992" height="620" alt="Screenshot 2026-09-27 at 5 09 25 AM" src="https://github.com/user-attachments/assets/a51d5bd6-0c8e-45c3-82d1-8f3a48505a8e" />
<img width="935" height="506" alt="Screenshot 2026-09-27 at 5 10 19 AM" src="https://github.com/user-attachments/assets/6ba38660-8912-495c-bb25-71c5d1ee9a08" />
<img width="906" height="602" alt="Screenshot 2026-09-27 at 5 10 40 AM" src="https://github.com/user-attachments/assets/4e7dc591-8655-487a-9047-483e0dda8abd" />
<img width="933" height="587" alt="Screenshot 2026-09-27 at 5 10 57 AM" src="https://github.com/user-attachments/assets/84f82903-4ccc-468b-b4b9-6734949f1d79" />
<img width="933" height="605" alt="Screenshot 2026-09-27 at 5 11 11 AM" src="https://github.com/user-attachments/assets/c7092765-aad9-4108-abc6-d803c943510d" />
<img width="931" height="593" alt="Screenshot 2026-09-27 at 5 11 27 AM" src="https://github.com/user-attachments/assets/66d70085-506d-4ecb-ac03-063d4112ffe0" />
<img width="927" height="607" alt="Screenshot 2026-09-27 at 5 12 00 AM" src="https://github.com/user-attachments/assets/1d843142-a24b-4199-a1a3-442397773b2f" />
<img width="926" height="608" alt="Screenshot 2026-09-27 at 5 12 34 AM" src="https://github.com/user-attachments/assets/03be9be5-ff0f-49c5-b86d-ebf244a58356" />
<img width="924" height="386" alt="Screenshot 2026-09-27 at 5 12 54 AM" src="https://github.com/user-attachments/assets/1694aad7-5079-4f9f-81f9-ff381aef5d63" />
<img width="924" height="573" alt="Screenshot 2026-09-27 at 5 13 09 AM" src="https://github.com/user-attachments/assets/c001b21c-cf87-4747-9e69-7b267be2847a" />
