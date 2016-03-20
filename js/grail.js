//
//  Revisting the GRAIL Handwriting Recognizer
//
//  A javascript implementation of Gabe Groner's handwriting recognizer
//  made for the Rand's GRAIL system in 1966.

var Grail = this.Grail = function () {

    var grail = this;
    grail.OnPenDown = OnPenDown;
    grail.OnPenUp = OnPenUp;
    grail.OnPenMove = OnPenMove;
    grail.IsPenDown = IsPenDown;
    grail.PenDownPos = PenDownPos;
    grail.PenUpPos = PenUpPos;
    grail.RawData = RawData;
    grail.RawCurvature = RawCurvature;
    grail.ThinnedCurvature = ThinnedCurvature;
    grail.SmoothData = SmoothData;
    grail.ThinnedData = ThinnedData;
    grail.CornerData = CornerData;
    grail.DirectionData = DirectionData;
    grail.SmoothingAmount = SmoothingAmount;
    grail.SetSmoothingAmount = SetSmoothingAmount;
    grail.ThinningThreshold = ThinningThreshold;
    grail.SetThinningThreshold = SetThinningThreshold;
    grail.CornerDegreeThreshold = CornerDegreeThreshold;
    grail.SetCornerDegreeThreshold = SetCornerDegreeThreshold;
    grail.ContainingRect = ContainingRect;
    grail.StrokeDescriptions = StrokeDescriptions;
    grail.IdentifySingleStroke = IdentifySingleStroke;
    grail.SetSkipIdentification = SetSkipIdentification;
    grail.SetCharacterCallback = SetCharacterCallback;
    grail.ClearCurrentStroke = ClearCurrentStroke;
    grail.CurrentStrokePossibilities = CurrentStrokePossibilities;
    grail.Init = Init;

    var _characterCallback = DefaultCharacterCallback;
    var _skipIdentification

    var _thinningThreshold;
    var _smoothingAmount;

    var _cornerDegreeThreshold;

    var _strokeTopLeft;
    var _strokeBottomRight;

    var _penIsDown;
    var _penDownPos;
    var _penUpPos;

    var _rawInput;
    var _smoothedInput;
    var _thinnedInput;
    var _rawCurvature;
    var _thinnedCurvature;
    var _directions;
    var _corners;

    var _ink_direction_possibilities;

    var _strokeDescriptions;


    //----------------------------------------------------------
    // stroke identification

    var NO_MATCH_FOUND_CHAR = "?";
    var NO_MATCH_FOUND_APOLOGY = "However, the rest of the stroke does not support this claim, \
                                  so we identify no valid character."

    function DefaultCharacterCallback(character, justifications) {
        console.log("Detected: " + character);
    }

    var neighbors = {
        0 : [1, 4, 5],
        1 : [0, 2, 4, 5, 6],
        2 : [1, 3, 5, 6, 7],
        3 : [2, 6, 7],
        4 : [0, 1, 5, 8, 9],
        5 : [0, 1, 2, 4, 6, 8, 9, 10],
        6 : [1, 2, 3, 5, 7, 9, 10, 11],
        7 : [2, 3, 6, 10, 11],
        8 : [4, 5, 9, 12, 13],
        9 : [4, 5, 6, 8, 10, 12, 13, 14],
        10 : [5, 6, 7, 9, 13, 14, 15],
        11 : [6, 7, 10, 14, 15],
        12 : [8, 9, 13],
        13 : [8, 9, 10, 12, 14],
        14 : [9, 10, 11, 13, 15],
        15 : [10, 11, 14]
    }

    function containsOneOf(a, items) {
        for (var i = 0; i < items.length; i++) {
            if (a.indexOf(items[i]) != -1) {
                return true; 
            }
        }
        return false;
    }

    var TOP_LEFT = [2, 3, 6, 7];
    var TOP_RIGHT = [0, 1, 4, 5];
    var BOTTOM_LEFT = [10, 11, 14, 15];
    var BOTTOM_RIGHT = [8, 9, 12, 13];
    var MIDDLE = [5, 6, 9, 10];
    var MIDDLE_BAND = [4, 5, 6, 7, 8, 9, 10, 11];
    var LEFT_EDGE = [3, 7, 11, 15];
    var RIGHT_EDGE = [0, 4, 8, 12];
    var TOP_RIGHT_EDGE = [0];
    var TOP_EDGE = [0, 1, 2, 3];
    var BOTTOM_HALF = [8, 9, 10, 11, 12, 13, 14, 15];
    var TOP_HALF = [0, 1, 2, 3, 4, 5, 6, 7];
    var LEFT_HALF = [2, 3, 6, 7, 10, 11, 14, 15];
    var RIGHT_HALF = [0, 1, 4, 5, 8, 9, 12, 13];
    var BOTTOM_RIGHT_EDGE = [12];
    var BOTTOM_LEFT_EDGE = [15];

    function hasCorner(stroke, location) {
        return containsOneOf(stroke.corners, location);
    }

    function strokeIsClosedTight(stroke) {
        return stroke.penDown == stroke.penUp;
    }

    function strokeIsClosed(stroke) {
        return strokeIsClosedTight(stroke) || neighbors[stroke.penDown].indexOf(stroke.penUp) != -1;
    }

    function strokeEndIn(stroke, location) {
        return location.indexOf(stroke.penUp) != -1;
    }

    function strokeStartIn(stroke, location) {
        return location.indexOf(stroke.penDown) != -1;
    }

    function strokeTurnsAfterFirstFourSegments(stroke, direction) {
        for (var i = 4; i < Math.min(stroke.directions.length, 6); i++) {
            if (stroke.directions[i].dir == direction) {
                return true;
            }
        }
        return false;
    }

    function strokeTurnsImmediatelyAfterFirstFourSegments(stroke, direction) {
        if (stroke.directions.length > 4)
        {
            return stroke.directions[4].dir == direction
        }

        return false;
    }

    function disc71(stroke, justifications) {
        if (stroke.aspectRatio < 3) 
        {
            justifications.push("Because the aspect ratio of the stroke is less than 3, ");
            return ["7"];
        }
        else  
        { 
            justifications.push("Because the aspect ratio of the stroke is greater than 3, ");
            return ["1"];
        }
    }

    function disc589SE(stroke, justifications) {
        // LDRD
        if (strokeStartIn(stroke, TOP_RIGHT) && strokeEndIn(stroke, BOTTOM_LEFT))
        {
            justifications.push("Because the stroke starts in the top right of the symbol and ends in the bottom left, ");
            if (stroke.corners.length == 0)
            {
                justifications.push("and the stroke has no corners, ");
                return ["S"]; 
            }
            if (hasCorner(stroke, TOP_RIGHT))
            {
                justifications.push("and the stroke has a corner in the top right, ");
                return ["9"]; 
            }
            if (stroke.corners.length == 2 && hasCorner(stroke, TOP_LEFT))
            {
                justifications.push("and the stroke has two corners, one of which is in the upper left, ");
                return ["5"]; 
            }

            return ["S"]; 
        }

        if (strokeStartIn(stroke, TOP_RIGHT) && strokeEndIn(stroke, BOTTOM_RIGHT))
        {
            justifications.push("Because the stroke starts in the top right of the symbol and ends in the bottom right, ");
            if (hasCorner(stroke, TOP_RIGHT))
            {
                justifications.push("and the stroke has a corner in the top right, ");
                return ["9"]; 
            }

            return ["E"];
        }

        if (strokeIsClosed(stroke) && strokeEndIn(stroke, TOP_RIGHT))
        {
            justifications.push("Because the stroke start and end are close to one another, and the stroke ends in the top right, ");
            return ["8"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function discOJXU(stroke, justifications) {
        if (strokeIsClosed(stroke) && stroke.corners.length == 0)
        {
            justifications.push("Because the stroke start and end are close to each other, and the stroke has no corners, ");
            return ["O"];
        }
        if (strokeStartIn(stroke, TOP_RIGHT) && strokeEndIn(stroke, TOP_LEFT))
        {
            justifications.push("Because the stroke starts at the top of the symbol and ends in the bottom half of the symbol, ");
            return ["U"];
        }
        if (strokeStartIn(stroke, TOP_EDGE) && strokeEndIn(stroke, BOTTOM_HALF))
        {
            justifications.push("Because the stroke starts at the top of the symbol and ends in the bottom half of the symbol, ");
            return ["J"];
        }
        if (strokeStartIn(stroke, TOP_LEFT) && strokeEndIn(stroke, TOP_RIGHT))
        {
            justifications.push("Because the stroke starts in the top left of the symbol and ends in the top right of the symbol, ");
            return ["X"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function disc0UX(stroke, justifications) {
        if (strokeIsClosed(stroke))
        {
            justifications.push("Because the stroke start and end are close to each other, ");
            return ["O"];
        }
        if (strokeStartIn(stroke, TOP_RIGHT) && strokeEndIn(stroke, TOP_LEFT))
        {
            justifications.push("Because the stroke starts in the top right and ends in the top left, ");
            return ["U"];
        }
        if (strokeStartIn(stroke, TOP_LEFT) && strokeEndIn(stroke, TOP_RIGHT))
        {
            justifications.push("Because the stroke starts in the top left and ends in the top right, ");
            return ["X"];
        }
    }

    function disc023UX(stroke, justifications) {
        // RDLU
        if (strokeStartIn(stroke, TOP_HALF) && strokeEndIn(stroke, TOP_HALF)) {
            return disc0UX(stroke, justifications);
        }
        else
        {
            return disc32(stroke, justifications);
        }
    }

    function disc680D4(stroke, justifications) {
        // DRUL
        if (strokeStartIn(stroke, TOP_LEFT) && strokeEndIn(stroke, BOTTOM_HALF) && hasCorner(stroke, RIGHT_EDGE))
        {
            justifications.push("Because the stroke starts in the top left of the symbol and ends in the bottom half of the symbol, and has a corner on the right side of the symbol, ");
            return ["4"];
        }

        if (strokeStartIn(stroke, TOP_EDGE) && !strokeIsClosedTight(stroke) && (strokeEndIn(stroke, MIDDLE_BAND) || strokeEndIn(stroke, BOTTOM_HALF)))
        {
            justifications.push("Because the stroke starts in the top of the symbol and is not a closed stroke, ");
            return ["6"];
        }

        if (strokeIsClosed(stroke))
        {
            justifications.push("Because the stroke start and end are close to one another, ");
            if (strokeStartIn(stroke, LEFT_EDGE))
            {
                justifications.push("and the stroke starts on the left edge of the symbol, ");
                return ["D"];
            }
            if (strokeStartIn(stroke, TOP_EDGE))
            {
                justifications.push("and the stroke starts at the top of the symbol, ");
                return ["O"];
            }
            if (strokeStartIn(stroke, MIDDLE_BAND))
            {
                justifications.push("and the stroke starts in the middle of the symbol, ");
                return ["8"];
            }
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function discE6(stroke, justifications) {
        if (strokeStartIn(stroke, TOP_RIGHT) && strokeEndIn(stroke, BOTTOM_RIGHT))
        {
            justifications.push("Because the stroke starts in the top right and ends in the bottom right of the symbol, ");
            return ["E"];
        }
        if (strokeStartIn(stroke, TOP_RIGHT) && strokeEndIn(stroke, BOTTOM_LEFT))
        {
            justifications.push("Because the stroke starts in the top right and ends in the bottom left, ");
            return ["6"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function disc98Q(stroke, justifications) {
        // LURD
        if (strokeIsClosed(stroke) && strokeStartIn(stroke, MIDDLE_BAND) && strokeEndIn(stroke, MIDDLE_BAND)) 
        {
            justifications.push("Because the stroke start and end are close to one another and both are in the middle of the symbol, ");
            return ["8"];
        }
        if (strokeEndIn(stroke, BOTTOM_LEFT)) 
        {
            justifications.push("Because the stroke end is in the bottom left part of the symbol, ");
            return ["9"];
        }
        if (strokeEndIn(stroke, BOTTOM_RIGHT)) 
        {
            justifications.push("Because the stroke end is in the bottom right part of the symbol, ");
            return ["Q"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function discOU(stroke, justifications) {
        if (strokeIsClosed(stroke))
        {
            justifications.push("Because the stroke start and end are close to one another, ");
            return ["O"];
        }
        if (strokeStartIn(stroke, TOP_LEFT) && strokeEndIn(stroke, TOP_RIGHT)) {
            justifications.push("Because the stroke start and end are far from one another, ");
            return ["U"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }



    function disc89CGS6(stroke, justifications) {
        // ULDR
        if (strokeStartIn(stroke, TOP_RIGHT) && strokeEndIn(stroke, BOTTOM_HALF))
        {
            if (hasCorner(stroke, TOP_RIGHT))
            {
                justifications.push("Because the stroke starts in the top right and ends in the bottom, and has a corner in the upper-right of the symbol, ");
                return ["9"]; 
            }
            if (strokeTurnsImmediatelyAfterFirstFourSegments(stroke, "up"))
            {
                justifications.push("Because the stroke starts in the top right and ends in the bottom, and turns up after the first four segments, ");
                return ["6"];
            }
            if (strokeTurnsImmediatelyAfterFirstFourSegments(stroke, "down"))
            {
                justifications.push("Because the stroke starts in the top right and ends in the bottom, and turns down after the first four segments, ");
                return ["S"]; 
            }
        }

        if (strokeStartIn(stroke, RIGHT_HALF) && strokeEndIn(stroke, RIGHT_HALF))
        {
            justifications.push("Because the stroke starts and ends on the right side of the symbol, ");

            if (strokeTurnsImmediatelyAfterFirstFourSegments(stroke, "left"))
            {
                justifications.push("and the stroke turns left after the first four segments, ");
                return ["G"];
            }
            if (hasCorner(stroke, RIGHT_EDGE))
            {
                justifications.push("and the stroke has a corner on the right edge of the symbol, ");
                return ["G"];
            }
            if (strokeTurnsImmediatelyAfterFirstFourSegments(stroke, "up"))
            {
                justifications.push("and the stroke turns up after the first four segments, ");
                return ["C"];
            }
            if (stroke.directions.length == 4)
            {
                justifications.push("and the stroke only has four segments, ");
                return ["C"];
            }
        }

        if (strokeIsClosed(stroke)) 
        {
            justifications.push("Because the stroke start and end are close to one another, ");
            return ["8"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }


    function disc238BDPR(stroke, justifications) {
        // URDR
        // URDL
        if (strokeStartIn(stroke, BOTTOM_LEFT) && strokeEndIn(stroke, MIDDLE_BAND) && stroke.directions.length == 4)
        {
            justifications.push("Because the stroke starts in the bottom left, ends in the top left, and has four direction segments, ");
            return ["P"];
        }

        if (strokeStartIn(stroke, BOTTOM_HALF) && strokeEndIn(stroke, BOTTOM_HALF))
        {
            justifications.push("Because the stroke starts and ends in the bottom half of the symbol, ");
            if (strokeTurnsAfterFirstFourSegments(stroke, "right"))
            {
                justifications.push("and the stroke turns right after the first four segments, ");
                if (strokeEndIn(stroke, BOTTOM_LEFT))
                {
                    justifications.push("and it ends in the bottom left of the symbol, ");
                    return ["B"];
                }
                if (strokeEndIn(stroke, BOTTOM_RIGHT))
                {
                    justifications.push("and it ends in the bottom right of the symbol, ");
                    return ["R"];
                }
            }
            else if (hasCorner(stroke, MIDDLE_BAND))
            {
                justifications.push("and there is a corner in the middle, ");
                if (strokeEndIn(stroke, BOTTOM_LEFT))
                {
                    justifications.push("and the stroke ends in the bottom left of the symbol, ");
                    return ["B"];
                }
                if (strokeEndIn(stroke, BOTTOM_RIGHT))
                {
                    justifications.push("and the stroke ends in the bottom right of the symbol, ");
                    return ["R"];
                }
            }
            else
            {
                return ["D"];
            }
        }

        if (strokeIsClosed(stroke)) {
            justifications.push("Because the stroke start and end are close to one another, ");
            return ["8"];
        }

        if (strokeStartIn(stroke, TOP_LEFT) && strokeEndIn(stroke, BOTTOM_RIGHT_EDGE) && !hasCorner(stroke, MIDDLE)) {
            justifications.push("Because the stroke starts in the top left and ends in the bottom right, ");
            return ["2"];
        }

        if (strokeStartIn(stroke, TOP_LEFT) && strokeEndIn(stroke, BOTTOM_HALF)) {
            justifications.push("Because the stroke starts on the left side of the symbol and ends in the bottom half of the symbol, ");
            return ["3"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function disc6OCG9(stroke, justifications) {
        // LDRU
        if (strokeStartIn(stroke, TOP_EDGE) && strokeEndIn(stroke, TOP_EDGE) && strokeIsClosed(stroke))
        {
            justifications.push("Because the stroke starts and ends near the top of the symbol, ");
            return ["O"]; 
        }
        if (strokeTurnsImmediatelyAfterFirstFourSegments(stroke, "left"))
        {
            if (strokeEndIn(stroke, MIDDLE))
            {
                justifications.push("Because the stroke starts turns left after the first four segments and ends in the middle of the symbol, ");
                return ["G"]; 
            }
            if (strokeEndIn(stroke, BOTTOM_LEFT))
            {
                justifications.push("Because the stroke starts turns left after the first four segments and ends in the bottom left of the symbol, ");
                return ["6"]; 
            }
        }
        if (strokeEndIn(stroke, RIGHT_HALF) && strokeStartIn(stroke, RIGHT_HALF) && !hasCorner(stroke, TOP_RIGHT))
        {
            justifications.push("Because the stroke starts and ends in the right half of the symbol, and does not turn ever turn left, ");
            return ["C"]; 
        }
        if (strokeEndIn(stroke, BOTTOM_HALF) && strokeStartIn(stroke, TOP_RIGHT) && hasCorner(stroke, TOP_RIGHT))
        {
            justifications.push("Because the stroke starts in the top right, ends in the bottom half, and has a corner in the top right of the symbol, ");
            return ["9"]; 
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function discS8(stroke, justifications) {
        if (strokeStartIn(stroke, TOP_RIGHT) && strokeEndIn(stroke, BOTTOM_LEFT))
        {
            justifications.push("Because the stroke starts in the top right and ends in the bottom left, ");
            return ["S"];}
        if (strokeIsClosed(stroke))
        {
            justifications.push("Because the stroke start and end point are close to one another, ");
            return ["8"];
        }
        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

function disc32Z(stroke, justifications) {
        if (strokeEndIn(stroke, BOTTOM_RIGHT))
        {
            return disc2Z(stroke, justifications);
        }
        if (strokeEndIn(stroke, BOTTOM_LEFT))
        {
            justifications.push("Because the stroke ends in the bottom left of the symbol, ");
            return ["3"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function disc32(stroke, justifications) {
        if (strokeEndIn(stroke, BOTTOM_RIGHT_EDGE))
        {
            justifications.push("Because the stroke ends in the bottom right of the symbol, ");
            return ["2"];
        }
        if (strokeEndIn(stroke, BOTTOM_LEFT)) 
        {
            justifications.push("Because the stroke ends in the bottom left of the symbol, ");
            return ["3"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function disc73(stroke, justifications) {
        // RDL*
        if (stroke.corners.length > 1) 
        {
            justifications.push("Because there is more than one corner, ");
            return ["3"];
        }
        if (hasCorner(stroke, TOP_RIGHT_EDGE) && stroke.corners.length == 1) 
        {
            justifications.push("Because the stroke has one corner in the top right, ");
            return ["7"];
        }

        justifications.push("Because the stroke has no corners of interest, ");
        return ["3"];
    }

    function discNM(stroke, justifications) {
        if (strokeEndIn(stroke, TOP_RIGHT)) 
        {
            justifications.push("Because the stroke ends in the top right of the symbol, ");
            return ["N"];
        }
        if (strokeEndIn(stroke, BOTTOM_RIGHT))
        {
            justifications.push("Because the stroke ends in the bottom right of the symbol, ");
            return ["M"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function discNMA(stroke, justifications) {
        if (strokeTurnsImmediatelyAfterFirstFourSegments(stroke, "left")) 
        {
            justifications.push("Because the stroke turns left after the first four segments, ");
            return ["A"];
        }

        return discNM(stroke, justifications);
    }

    function discNA(stroke, justifications) {
        if (strokeEndIn(stroke, TOP_RIGHT))
        {
            justifications.push("Because the stroke ends in the top-right of the symbol, ");
            return ["N"];
        }
        if (strokeEndIn(stroke, LEFT_EDGE))
        {
            justifications.push("Because the stroke ends on the left side of the symbol, ");
            return ["A"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function disc1A(stroke, justifications) {
        if (strokeStartIn(stroke, BOTTOM_LEFT_EDGE) && strokeEndIn(stroke, BOTTOM_RIGHT_EDGE))
        {
            justifications.push("Because the stroke starts in the bottom-left and ends in the bottom-right of the symbol, ");
            return ["A"];
        }
        
        justifications.push("Because the stroke does not look like an A, ");
        return ["1"];

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function discWK(stroke, justifications) {
        if (strokeEndIn(stroke, TOP_RIGHT))
        {
            justifications.push("Because the stroke ends in the top right of the symbol, ");
            return ["W"];
        }
        if (strokeEndIn(stroke, BOTTOM_RIGHT))
        {
            justifications.push("Because the stroke ends in the bottom right of the symbol, ");
            return ["K"];
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function disc2Z(stroke, justifications) {
        if (strokeStartIn(stroke, TOP_LEFT) && strokeEndIn(stroke, BOTTOM_RIGHT))
        {
            if (hasCorner(stroke, TOP_RIGHT) && hasCorner(stroke, BOTTOM_LEFT))
            {
                justifications.push("Because the stroke has corners in the top right and bottom left, ");
                return ["Z"];               
            }
            if (hasCorner(stroke, BOTTOM_LEFT) && stroke.corners.length == 1)
            {
                justifications.push("Because the stroke has one corner in the bottom left, ");
                return ["2"];               
            }
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    function disc4Y(stroke, justifications) {
        if (stroke.corners.length >= 2 && hasCorner(stroke, RIGHT_EDGE) && hasCorner(stroke, TOP_EDGE) && strokeEndIn(stroke, RIGHT_HALF))
        {
            justifications.push("Because the stroke has one corner in the top of the symbol and another on the right side of the symbol, ");
            return ["4"];     
        }

        if (stroke.directions.length > 4 && strokeTurnsImmediatelyAfterFirstFourSegments(stroke, "left"))
        {
            justifications.push("Because the stroke turns left after the first four segments, ");
            return ["Y"];     
        }

        justifications.push(NO_MATCH_FOUND_APOLOGY);
        return [NO_MATCH_FOUND_CHAR];
    }

    var sequenceToPossibles = {
        "D***": {chars: ["I"]},
        "DL**": {chars: ["J"]},
        "DLU*": {chars: ["O", "J", "X", "U"], func: discOJXU},
        "DLUR": {chars: ["X", "O", "U"], func: disc0UX},
        "DLRU": {chars: ["X"]},
        "DR**": {chars: ["L"]},
        "DRL*": {chars: ["6"]},
        "DRLD": {chars: ["4"]},
        "DRU*": {chars: ["O", "U"], func: discOU},
        "DRUD": {chars: ["4", "Y"], func: disc4Y},
        "DRUL": {chars: ["6", "8", "O", "D", "4"], func: disc680D4},
        "DRUR": {chars: ["8"]},
        "DU**": {chars: ["V"]},
        "DUD*": {chars: ["K"]},
        "DUDU": {chars: ["W"]},
        "DUDR": {chars: ["W", "K"], func: discWK},
        "DURD": {chars: ["H"]},
        "LD**": {chars: ["F"]},
        "LDL*": {chars: ["S"]},
        "LDLD": {chars: ["E"]},
        "LDRL": {chars: ["E", "6"], func: discE6},
        "LRDL": {chars: ["S", "8"], func: discS8},
        "LRDR": {chars: ["E"]},
        "LRL*": {chars: ["S"]},
        "LRLD": {chars: ["E"]},
        "LRLR": {chars: ["E"]},
        "LDR*": {chars: ["C"]},
        "LDRD": {chars: ["5", "8", "9", "S", "E"], func: disc589SE},
        "LDRU": {chars: ["6", "O", "C", "G", "9"], func: disc6OCG9},
        "LURD": {chars: ["9", "8", "Q"], func: disc98Q},
        "RLD*": {chars: ["7"]},
        "RLDR": {chars: ["3", "2", "Z"], func: disc32Z},
        "RLRL": {chars: ["3"]},
        "RLR*": {chars: ["2", "Z"], func: disc2Z},
        "RLRD": {chars: ["3"]},
        "RD**": {chars: ["7", "1"], func: disc71},
        "RDL*": {chars: ["7", "3"], func: disc73},
        "RDLD": {chars: ["2", "3"], func: disc32},
        "RDLU": {chars: ["O", "2", "3", "U", "X"], func: disc023UX},
        "RDRD": {chars: ["3"]},
        "RDR*": {chars: ["2", "Z"], func: disc2Z},
        "RDLR": {chars: ["3", "2", "Z"], func: disc32Z},
        "UD**": {chars: ["1", "A"], func: disc1A},
        "UDL*": {chars: ["A"]},
        "UDR*": {chars: ["2"]},
        "UDU*": {chars: ["N", "A"], func: discNA},
        "UDUL": {chars: ["A"]},
        "UDUD": {chars: ["M", "N"], func: discNM},
        "UDUR": {chars: ["M", "N"], func: discNM},
        "UDRU": {chars: ["M", "N"], func: discNM},
        "UDRD": {chars: ["M", "N"], func: discNM},
        "URU*": {chars: ["M", "N"], func: discNM},
        "URUD": {chars: ["M", "N"], func: discNM},
        "URDU": {chars: ["M", "N", "A"], func: discNMA},
        "ULDR": {chars: ["8", "9", "C", "G", "S", "6"], func: disc89CGS6},
        "ULR*": {chars: ["T"]},
        "URDR": {chars: ["2", "3", "8", "B", "D", "P", "R"], func: disc238BDPR},
        "URDL": {chars: ["2", "3", "8", "B", "D", "P", "R"], func: disc238BDPR},
        "URLR": {chars: ["B"]},
        "UR**": {chars: ["F"]}
    };

    function IdentifySingleStroke() {
        var directions = back(_strokeDescriptions).directions;

        var firstFourDirections = ["*", "*", "*", "*"];
        for (var i = 0; i < Math.min(4, directions.length); i++) {
            firstFourDirections[i] = directions[i].dir.charAt(0).toUpperCase();
        }

        var firstFourDirectionsString = firstFourDirections.join("");
        var possibilities = sequenceToPossibles[firstFourDirectionsString];
        var justifications = [];

        if (possibilities == undefined) {
            justifications.push("The first four directions of the stroke do not match \
                                 any valid character.");
            _characterCallback(NO_MATCH_FOUND_CHAR, justifications);
        } else if (possibilities.chars.length == 1) {
            justifications.push("Based on the first four directions of the stroke, \
                                 we can immediately identify the character as: ");
            _characterCallback(possibilities.chars[0], justifications);
        } else {
            justifications.push("Based on the first four direction segments, \
                                 the stroke is assumed to be one of the following characters: <b>" 
                                 + possibilities.chars.join(",") + "</b>.<br/><br/>");
            var result = possibilities.func(back(_strokeDescriptions), justifications);
            justifications.push("we identify the character as: ");
            _characterCallback(result, justifications);
        }
    }


    //----------------------------------------------------------
    // stroke description

    function contains(rect, point) {
        return (
            point.x >= rect.x0 
            && point.x <= rect.x1 
            && point.y <= rect.y0 
            && point.y >= rect.y1);
    }

    function containingIndex(rects, point) {
        for (var r = 0; r < rects.length; r++) {
            if (contains(rects[r], point)) {
                return r;
            }
        }
    }

    function createSymbolGrid(rect) {
        var width = rect.x1 - rect.x0;
        var height = rect.y0 - rect.y1;
        var stepX = width / 4;
        var stepY = height / 4;
        var strokeTopRightX = rect.x0 + width;
        var strokeTopRightY = rect.y0;

        var PADDING = 0.000001;

        var gridRects = [];

        for (var y = 0; y < 4; y++) {
          for (var x = 1; x < 5; x++) {
            var topLeftX = strokeTopRightX - (x * stepX);
            var topLeftY = strokeTopRightY - (y * stepY);
            var bottomRightX = topLeftX + stepX;
            var bottomRightY = topLeftY - stepY;
            gridRects.push({
                x0: topLeftX - PADDING,
                y0: topLeftY + PADDING,
                x1: bottomRightX + PADDING,
                y1: bottomRightY - PADDING});
            }
        }

        return gridRects;
    }


    function createStrokeDescription(containingRect, corners) {
        var width = containingRect.x1 - containingRect.x0;
        var height = containingRect.y0 - containingRect.y1;
        var aspectRatio = height / width;
        var centerX = containingRect.x0 + (width / 2.0);
        var centerY = containingRect.y0 - (height / 2.0);

        var symbolGrid = createSymbolGrid(containingRect);

        var cornerPositions = [];
        for (var i = 0; i < corners.length; i++) {
            for (var r = 0; r < symbolGrid.length; r++) {
                if (contains(symbolGrid[r], corners[i])) {
                    cornerPositions.push(r);
                }
            }
        }

        var penDownIndex = containingIndex(symbolGrid, PenDownPos());
        var penUpIndex = containingIndex(symbolGrid, PenUpPos());

        return {
            width: width,
            height: height,
            aspectRatio: aspectRatio,
            center: {x: centerX, y: centerY},
            penDown: penDownIndex,
            penUp: penUpIndex,
            corners: cornerPositions,
            directions: ThinnedCurvature(),
            rawData: RawData(),
            smoothData: SmoothData(),
            thinnedData: ThinnedData(),
            cornerData: CornerData(),
            thinnedCurvature: ThinnedCurvature(),
            penDownPoint: PenDownPos(),
            penUpPoint: PenUpPos()
        }
    }


    //----------------------------------------------------------
    // construct

    _smoothingAmount = 0.75;
    _thinningThreshold = 0.2;
    _cornerDegreeThreshold = 90;
    _skipIdentification = false;

    Init();
    return grail;


    //----------------------------------------------------------
    // internals

    function back(arr) {
        return arr[arr.length - 1];
    }

    function penultimate(arr) {
        return arr[arr.length - 2];
    }

    function Expand() {
        var lastThinned = back(_thinnedInput);

        _strokeTopLeft.x = Math.min(_strokeTopLeft.x, lastThinned.x);
        _strokeTopLeft.y = Math.max(_strokeTopLeft.y, lastThinned.y);

        _strokeBottomRight.x = Math.max(_strokeBottomRight.x, lastThinned.x);
        _strokeBottomRight.y = Math.min(_strokeBottomRight.y, lastThinned.y);
    }

    function CurrentCardinal() {
        if (_thinnedInput.length < 2) {
          return "";
        }

        var currentThinned = back(_thinnedInput);
        var penThinned = penultimate(_thinnedInput);

        var diff_x = currentThinned.x - penThinned.x;
        var diff_y = currentThinned.y - penThinned.y;

        if (Math.abs(diff_x) >= Math.abs(diff_y)) {
          return diff_x >= 0 ? "right" : "left";
        }
        else {
          return diff_y >= 0 ? "up" : "down";
        }
    }


    function QuantizeInk(direction)
    {
        for (var i = 0; i < _ink_direction_possibilities.length; i++) {
          var curr = _ink_direction_possibilities[0];
          var diff = Math.abs (direction - curr);
          for (var val = 0; val < _ink_direction_possibilities.length; val++) {
            var newdiff = Math.abs (direction - _ink_direction_possibilities[val]);
            if (newdiff < diff) {
                diff = newdiff;
                curr = _ink_direction_possibilities[val];
            }
          }   
        }

        return curr;
    }


    function NormalizedChangeInDirection(prev, curr) {
      var change = curr - prev;

      if (change < -180) {
        change = 360 + change;
      }
      else if (change > 180) {
        change = 360 - change;
      }

      return Math.abs(change);
    }


    function CheckForCorner() {
        if (_directions.length < 5) {
            return;
        }

        var prev1 = _directions[_directions.length - 1];
        var prev2 = _directions[_directions.length - 2];
        var prev3 = _directions[_directions.length - 3];
        var prev4 = _directions[_directions.length - 4];
        var prev5 = _directions[_directions.length - 5];

        if (NormalizedChangeInDirection(prev2, prev1) <= 22.5) {
          if (NormalizedChangeInDirection(prev5, prev4) <= 22.5) {
            if (NormalizedChangeInDirection(prev4, prev2) >= _cornerDegreeThreshold) {
                if (back(_corners) != _thinnedInput[_thinnedInput.length - 4])
                { // avoid duplicate corners
                    _corners.push(_thinnedInput[_thinnedInput.length - 3]);
                }
            }
          }
        }   
    }


    function Ink() {
        var lastThinned = back(_thinnedInput);
        var penThinned = penultimate(_thinnedInput);

        var diff_x = lastThinned.x - penThinned.x;
        var diff_y = lastThinned.y - penThinned.y;

        var theta_radians = Math.atan2(diff_y, diff_x);
        var theta_degrees = theta_radians * (180 / Math.PI);

        if (theta_degrees < 0) {
          theta_degrees = 180 + (180 + theta_degrees);
        }

        _directions.push(QuantizeInk(theta_degrees));
        CheckForCorner();
    }


    function Curve() {
        var currentDir = CurrentCardinal();
        var lastThinned = back(_thinnedInput);

        if (_rawCurvature.length == 0) {
            _rawCurvature.push({dir: currentDir, point: lastThinned});
            return;
        }

        var lastThinnedCurvature = back(_thinnedCurvature);
        var lastCurvature = back(_rawCurvature); 

        if (currentDir == lastCurvature.dir && 
            (_thinnedCurvature.length == 0 || (currentDir != lastThinnedCurvature.dir)))
        {
          _thinnedCurvature.push({dir: currentDir, point: lastThinned});
        }

        _rawCurvature.push({dir: currentDir, point: lastThinned});  
    }

    function Smooth() {
        var lastSmoothed = back(_smoothedInput);
        var lastRaw = back(_rawInput);

        var A = _smoothingAmount;
        var B = 1 - _smoothingAmount;

        var smoothedX = (A * lastSmoothed.x) + (B * lastRaw.x);
        var smoothedY = (A * lastSmoothed.y) + (B * lastRaw.y);

        _smoothedInput.push({x: smoothedX, y: smoothedY});

        Thin();
    }

    function Thin() {
        var lastSmoothed = back(_smoothedInput);

        if (_thinnedInput.length == 0) {
            _thinnedInput.push(lastSmoothed);
            Expand();
            Curve();
            return;
        }

        var lastThinned = back(_thinnedInput);
        var deltaX = Math.abs(lastSmoothed.x - lastThinned.x);
        var deltaY = Math.abs(lastSmoothed.y - lastThinned.y);

        if (deltaX >= _thinningThreshold || deltaY >= _thinningThreshold) {
            _thinnedInput.push(lastSmoothed);
            Expand();
            Ink();
            Curve();
        }
    }

    function ReRun() {
        if (_rawInput.length == 0) {
            return;
        }

        var RawInput = _rawInput;
        Init();

        OnPenDown(RawInput[0]);

        for (var i = 1; i < RawInput.length; i++) {
            OnPenMove(RawInput[i]);
        }

        OnPenUp(back(RawInput));
    }

    function CurrentStrokePossibilities()
    {
        var dirCount = _thinnedCurvature.length;
        if (dirCount == 0)
        {
            return {"ALL":true};
        }

        var firstFourDirections = ["*", "*", "*", "*"];
        for (var i = 0; i < Math.min(4, _thinnedCurvature.length); i++) {
            firstFourDirections[i] = _thinnedCurvature[i].dir.charAt(0).toUpperCase();
        }
        var firstFourDirectionsString = firstFourDirections.join("");

        var possibilities = {};

        for (var key in sequenceToPossibles) {
          if (sequenceToPossibles.hasOwnProperty(key)) {
            var isMatch = true;
            if (firstFourDirectionsString === key  && sequenceToPossibles[key].chars.length == 1)
            {
                possibilities[sequenceToPossibles[key].chars[0]] = "match";
                continue;
            }

            for (var j = 0; j < Math.min(4, _thinnedCurvature.length); j++)
            {
                if (key.charAt(j) != firstFourDirections[j])
                {
                    isMatch = false;
                    continue;
                }
            }
            if (isMatch)
            {
                var possibleChars = sequenceToPossibles[key].chars;
                for (var k = 0; k < possibleChars.length; k++)
                {
                    if (possibilities[possibleChars[k]] != "match")
                    {
                        possibilities[possibleChars[k]] = true;
                    }
                }
            }
          }
        }
        return possibilities;
    }


    //----------------------------------------------------------
    // interface

    function SetCharacterCallback(callback) { _characterCallback = callback; }

    function ClearCurrentStroke() {
        _rawInput = [];
        _rawCurvature = [];
        _thinnedCurvature = [];
        _smoothedInput = [];
        _thinnedInput = [];
        _corners = [];
        _directions = [];
    }

    function RawData() { return _rawInput; }
    function RawCurvature() { return _rawCurvature; }
    function ThinnedCurvature() { return _thinnedCurvature; }
    function SmoothData() { return _smoothedInput; }
    function ThinnedData() { return _thinnedInput; }
    function CornerData() { return _corners; }
    function DirectionData() { return _directions; }

    function SmoothingAmount() { return _smoothingAmount; }
    function SetSmoothingAmount(amt) {
        _smoothingAmount = amt;
        ReRun();
    }

    function ThinningThreshold() { return _thinningThreshold; }
    function SetThinningThreshold(amt) {
        _thinningThreshold = amt;
        ReRun();
    }

    function CornerDegreeThreshold() { return _cornerDegreeThreshold; }
    function SetCornerDegreeThreshold(amt) {
        _cornerDegreeThreshold = amt;
        ReRun();
    }

    function SetSkipIdentification(skip) {
        _skipIdentification = skip;
    }

    function OnPenDown(pos) {
        _penDownPos = pos;
        _penIsDown = true;
        _rawInput.push(pos);
        _smoothedInput.push(pos);
        Thin();
    }

    function OnPenUp(pos) {
        _penUpPos = back(_thinnedInput);
        _penIsDown = false;
        _strokeDescriptions.push(
            createStrokeDescription(ContainingRect(), CornerData()));
        if (!_skipIdentification)
        {
            IdentifySingleStroke();
        }
    }

    function OnPenMove(pos) {
        pos = {x: Math.round(pos.x * 10) / 10, y: Math.round(pos.y * 10) / 10}
        if (_penIsDown) {
            _rawInput.push(pos);
            Smooth();
        }
    }

    function IsPenDown() { return _penIsDown; }
    function PenDownPos() { return _penDownPos; }
    function PenUpPos() { return _penUpPos; }

    function StrokeDescriptions() { return _strokeDescriptions; }

    function ContainingRect() {
        return {
            x0: _strokeTopLeft.x,
            y0: _strokeTopLeft.y,
            x1: _strokeBottomRight.x,
            y1: _strokeBottomRight.y
        };
    }


    function Init() {
        _penIsDown = false;

        _strokeTopLeft = {x: Number.MAX_VALUE, y: Number.MIN_VALUE};
        _strokeBottomRight = {x: Number.MIN_VALUE, y: Number.MAX_VALUE}; 

        _rawInput = [];
        _smoothedInput = [];
        _thinnedInput = [];
        _rawCurvature = [];
        _thinnedCurvature = [];
        _directions = [];
        _corners = [];
        _penDownPos = {};
        _penUpPos = {};

        _strokeDescriptions = [];

        _ink_direction_possibilities = [];

        for (var i = 0; i < 16; i++) {
            _ink_direction_possibilities[i] = i * 22.5;
        }
    }


}; // end Grail