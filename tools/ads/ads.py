"""The 10 ad creatives. Copy is written for mute-first vertical viewing:

  * hook  — 2 short lines, punch word in [[double brackets]] renders as a gold block
  * b2/b3 — proof lines over real job photos
  * cta   — logo + phone + urgency

`shots` are photo keys from imaging.SOURCES; the first shot carries the hook.
"""
from dataclasses import dataclass, field


@dataclass
class Shot:
    key: str
    grade: str = "warm"
    anim: str = "push"          # push | pull | panl | panr | shake | tilt
    reveal: bool = False        # open on a dirty->clean reveal wipe


@dataclass
class Ad:
    n: int
    slug: str
    title: str
    vo: str                     # audio/vo/<file>.mp3 stem
    hook: list[str]
    kicker: str
    lines2: list[str]
    lines3: list[str]
    cta: list[str]
    cta_sub: str
    shots: list[Shot]
    bpm: int = 112
    prog: str = "bold"
    speed: float = 1.0          # VO tempo adjustment
    transition: str = "smoothleft"
    accent: str = "gold"
    badge: str = ""             # optional social-proof badge in the CTA
    cta_eyebrow: str = "FREE QUOTES · ISLAND-WIDE O'AHU"
    hashtags: str = ""
    notes: str = ""
    kicker2: str = ""
    kicker3: str = ""
    wide_beats: tuple[int, ...] = ()   # scene indices rendered photo-first

    @property
    def filename(self) -> str:
        return f"{self.n:02d}-{self.slug}"


ADS: list[Ad] = [
    Ad(
        n=1, slug="red-dirt", title="Red Dirt Doesn't Rinse Off", vo="01-red-dirt",
        kicker2="THAT'S THE RED DIRT",
        kicker3="CHEMICAL WASH + PRESSURE",
        kicker="NOT ALL DIRT IS THE SAME",
        hook=["O'AHU [[RED DIRT]]", "DOESN'T RINSE OFF"],
        lines2=["PRESSURE ALONE", "WON'T [[TOUCH IT]]"],
        lines3=["CHEMICAL WASH", "THEN WE [[BLAST IT]]"],
        cta=["WE BLAST IT", "[[OFF.]]"],
        cta_sub="Driveways · Walls · Lanais · Roofs",
        shots=[Shot("stain", "punch", "push"), Shot("g_driveway", "warm", "panr"),
               Shot("driveway", "warm", "shake", reveal=True), Shot("garage", "cool", "pull")],
        wide_beats=(1, 2),
        bpm=112, prog="bold", speed=1.10, transition="smoothleft",
        badge="LOCALLY OWNED SINCE 2020",
        hashtags="#PowerWashingOahu #Oahu #RedDirt #PressureWashing #Hawaii",
        notes="Pain-point hook. Strongest performer in cold traffic — open with this one.",
    ),
    Ad(
        n=2, slug="driveway", title="First Thing They See", vo="02-driveway",
        kicker2="CURB APPEAL, FIXED FAST",
        kicker3="CONCRETE, RESTORED",
        kicker="CURB APPEAL, FIXED IN ONE DAY",
        hook=["THE FIRST THING", "THEY [[SEE.]]"],
        lines2=["MAKE IT THE", "[[BEST PART]]"],
        lines3=["CONCRETE, BACK", "TO [[BRAND NEW]]"],
        cta=["NEIGHBORS WILL", "[[NOTICE]]"],
        cta_sub="Driveways · Walkways · Patios",
        shots=[Shot("driveway", "warm", "push"), Shot("finish", "warm", "tilt"),
               Shot("g_driveway", "punch", "push", reveal=True), Shot("community", "warm", "pull")],
        wide_beats=(1, 2),
        bpm=114, prog="sunny", speed=1.04, transition="whipup",
        badge="* 5.0 ON GOOGLE",
        hashtags="#DrivewayCleaning #OahuHomes #PowerWashingOahu #Kapolei #Mililani",
        notes="Best all-rounder. Uses the driveway before/after the site is built around.",
    ),
    Ad(
        n=3, slug="roof-algae", title="Black Streaks On Your Roof", vo="03-roof",
        kicker2="IT'S ALGAE, NOT DIRT",
        kicker3="SOFT WASHED, ZERO DAMAGE",
        kicker="ROOF ALGAE REMOVAL",
        hook=["BLACK STREAKS", "ON YOUR [[ROOF?]]"],
        lines2=["THAT'S [[ALGAE]]", "EATING SHINGLES"],
        lines3=["SOFT WASHED.", "[[ZERO]] DAMAGE."],
        cta=["ROOF LOOKS", "[[NEW AGAIN]]"],
        cta_sub="Soft wash · No pressure damage",
        shots=[Shot("roof", "cool", "push", reveal=True), Shot("g_roof", "warm", "panl"),
               Shot("hero", "cool", "pull"), Shot("g_siding", "warm", "push")],
        wide_beats=(1,),
        bpm=110, prog="drive", speed=1.08, transition="circleopen",
        badge="ALGAE & MOLD SPECIALISTS",
        hashtags="#RoofCleaning #SoftWash #Oahu #PowerWashingOahu #Kaneohe",
        notes="Educational hook. Works best retargeted to homeowners who visited Services.",
    ),
    Ad(
        n=4, slug="commercial", title="They Judge The Parking Lot", vo="04-commercial",
        kicker2="CURBSIDE FIRST IMPRESSIONS",
        kicker3="ISLAND-WIDE COVERAGE",
        kicker="COMMERCIAL PRESSURE WASHING",
        hook=["THEY JUDGE", "YOUR [[PARKING LOT]]"],
        lines2=["BEFORE THEY", "EVER [[WALK IN]]"],
        lines3=["CONCRETE · SIDEWALKS", "[[STOREFRONTS]]"],
        cta=["ISLAND-WIDE", "[[COMMERCIAL]] WASHES"],
        cta_sub="Property managers · HOAs · Retail",
        shots=[Shot("g_commercial", "cool", "panr", reveal=True), Shot("cta", "warm", "push"),
               Shot("g_condo", "warm", "tilt"), Shot("crew", "warm", "pull")],
        wide_beats=(0, 2),
        bpm=108, prog="drive", speed=1.06, transition="hblur",
        badge="FULLY INSURED CREWS",
        hashtags="#CommercialCleaning #PropertyManagement #Oahu #PowerWashingOahu",
        notes="Target this one at property managers / HOAs, not homeowners.",
    ),
    Ad(
        n=5, slug="soft-wash", title="4000 PSI Can Wreck A House", vo="05-soft-wash",
        kicker2="CHEMICAL SOFT WASH",
        kicker3="PAINT-SAFE, MOLD-KILLING",
        kicker="THE SAFE WAY TO CLEAN",
        hook=["4000 PSI", "CAN [[WRECK]] A HOUSE"],
        lines2=["SO WE", "[[SOFT WASH]]"],
        lines3=["PAINT STAYS.", "DIRT [[GOES.]]"],
        cta=["MOLD · MILDEW", "[[RED DIRT]] GONE"],
        cta_sub="Siding · Stucco · Fences",
        shots=[Shot("g_siding", "warm", "push", reveal=True), Shot("g_hero", "punch", "tilt"),
               Shot("finish", "warm", "panl"), Shot("g_hero", "punch", "pull")],
        wide_beats=(1, 2),
        bpm=116, prog="bold", speed=1.06, transition="wipeup",
        badge="CHEMICAL SOFT WASH EXPERTS",
        hashtags="#SoftWashing #HouseWash #Oahu #PowerWashingOahu #EwaBeach",
        notes="Objection-killer. Pair with the roof ad for a 'safe cleaning' ad set.",
    ),
    Ad(
        n=6, slug="oil-stain", title="Oil Stain In The Stall", vo="06-oil-stain",
        kicker2="LIFTED & CAPTURED",
        kicker3="WASTE RECLAIM ON EVERY JOB",
        kicker="STAIN REMOVAL · RUNOFF CAPTURED",
        hook=["OIL STAIN", "IN THE [[STALL?]]"],
        lines2=["NOT YOUR", "[[PROBLEM]] ANYMORE"],
        lines3=["LIFTED. CAPTURED.", "[[GONE.]]"],
        cta=["STALLS BACK", "IN [[SERVICE]]"],
        cta_sub="Oil lift · Waste reclaim · HOAs",
        shots=[Shot("g_oilstain", "warm", "push"), Shot("stain", "punch", "shake", reveal=True),
               Shot("g_oilstain", "punch", "panr"), Shot("cta", "warm", "pull")],
        wide_beats=(1, 2),
        bpm=112, prog="drive", speed=1.00, transition="slideup",
        badge="LIQUID WASTE RECLAIM SYSTEM",
        hashtags="#OilStainRemoval #ParkingLotCleaning #Oahu #PowerWashingOahu",
        notes="Great for property managers and used-car lots. Very shareable visual.",
    ),
    Ad(
        n=7, slug="lanai-small-jobs", title="The Jobs Nobody Wants", vo="07-lanai",
        kicker2="SAME-DAY QUOTES",
        kicker3="NO JOB TOO SMALL",
        kicker="NO JOB TOO SMALL",
        hook=["THE SMALL JOBS", "NOBODY [[WANTS]]"],
        lines2=["LANAIS · WALKWAYS", "[[GARAGE FLOORS]]"],
        lines3=["WE DO THEM", "[[RIGHT]]"],
        cta=["SMALL JOB.", "[[SERIOUS]] CREW."],
        cta_sub="Same-day quotes available",
        shots=[Shot("g_lanai", "warm", "push", reveal=True), Shot("community", "warm", "panl"),
               Shot("work", "warm", "tilt"), Shot("finish", "warm", "pull")],
        wide_beats=(0, 2),
        bpm=118, prog="sunny", speed=1.02, transition="smoothright",
        badge="ISLAND-WIDE COVERAGE",
        hashtags="#LanaiCleaning #Oahu #PowerWashingOahu #Honolulu #HawaiiKai",
        notes="Cheapest job to fulfil — great for filling gaps in the schedule.",
    ),
    Ad(
        n=8, slug="malama-aina", title="We Capture Every Gallon", vo="08-aina",
        kicker2="ZERO RUNOFF",
        kicker3="MĀLAMA ʻĀINA FIRST",
        kicker="MĀLAMA ʻĀINA · PROTECT THE OCEAN",
        hook=["EVERY GALLON", "WE [[CAPTURE]]"],
        lines2=["BECAUSE IT ALL", "RUNS TO THE [[OCEAN]]"],
        lines3=["CLEAN HOME.", "PROTECTED [[ʻĀINA]]."],
        cta=["CLEAN PROPERTY", "[[CLEAN OCEAN]]"],
        cta_sub="Water reclaim on every job",
        shots=[Shot("hero", "cool", "push", reveal=True), Shot("community", "warm", "panr"),
               Shot("crew", "warm", "tilt"), Shot("cta", "cool", "pull")],
        wide_beats=(0, 2),
        bpm=104, prog="sunny", speed=1.04, transition="circleopen",
        badge="LIQUID WASTE RECLAIM SYSTEM",
        hashtags="#MalamaAina #Oahu #EcoFriendlyCleaning #PowerWashingOahu",
        notes="Brand/differentiator ad. Lower direct response, highest share rate.",
    ),
    Ad(
        n=9, slug="five-star-local", title="Five Stars, Locally Owned", vo="09-reviews",
        kicker2="LOCALLY OWNED SINCE 2020",
        kicker3="REAL OʻAHU HOMEOWNERS",
        kicker="REAL REVIEWS FROM O'AHU HOMEOWNERS",
        hook=["5 STARS.", "LOCALLY [[OWNED.]]"],
        lines2=["SINCE 2020 ·", "ALL OVER [[O'AHU]]"],
        lines3=["THE CREW YOUR", "NEIGHBORS [[USE]]"],
        cta=["THE TEAM YOUR", "NEIGHBORS [[USE]]"],
        cta_sub="Locally owned & operated",
        shots=[Shot("crew", "warm", "push"), Shot("g_hero", "punch", "panr"),
               Shot("finish", "warm", "tilt", reveal=True), Shot("community", "warm", "pull")],
        wide_beats=(1,),
        bpm=110, prog="bold", speed=1.09, transition="pixelize",
        badge="***** 5.0 RATING",
        hashtags="#5StarService #Oahu #PowerWashingOahu #SupportLocal",
        notes="Trust builder for warm retargeting audiences.",
    ),
    Ad(
        n=10, slug="booking-this-week", title="Booking This Week", vo="10-book-now",
        kicker2="DRIVEWAY · ROOF · FULL WASH",
        kicker3="WEST SIDE OʻAHU",
        kicker="WEST SIDE O'AHU · LIMITED SLOTS",
        hook=["BOOKING", "THIS [[WEEK]]"],
        lines2=["WEST SIDE", "[[FILLING UP]]"],
        lines3=["CALL BEFORE", "IT'S [[GONE]]"],
        cta=["GET ON THE", "[[SCHEDULE]]"],
        cta_sub="Kapolei · Ewa · Waipahu · Mililani",
        shots=[Shot("g_driveway", "punch", "push", reveal=True), Shot("garage", "cool", "shake"),
               Shot("finish", "warm", "panl"), Shot("g_hero", "warm", "pull")],
        wide_beats=(0, 2),
        bpm=120, prog="drive", speed=1.05, transition="smoothleft",
        badge="FREE QUOTE IN MINUTES",
        hashtags="#Kapolei #EwaBeach #Oahu #PowerWashingOahu #BookNow",
        notes="Urgency ad. Run only when the schedule actually has room.",
    ),
]

BY_ID = {a.n: a for a in ADS}
