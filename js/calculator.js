var min_num = 1, max_num = 10;
var operator_list = {
    "+": "+"
    , "-": "-"
    , "*": "*"
    , "/": "/"
    , "+ -": "+-"
    , "* /": "*/"
    , "+ - * /": "+-*/"
};
var small_mult_table = true, over_tens = false;
var static_n2 = '-';
var num1, num2;
var operator = "+";

// stopwatch
var seconds = 0; var minutes = 0; var hours = 0; var t;

var n_right = 0, n_wrong = 0;

var valid_settings = true;

var motivational_quotes = [
    'Du kannst schon super rechnen, weiter so!',
    'Schon wieder richtig! Du wirst immer besser!',
    'Gut gemacht!',
    'Super!',
    'Sehr gut!',
    'Weiter so!'
]

var alpaca_facts = [
    'Alpakas können summen.',
    '80% aller Alpakas leben in Peru.',
    'Alpakas sind Herdentiere.',
    'Es gibt Alpakas in mehr als 20 verschiedenen Farben.',
    'Weibliche Alpakas spucken Männchen an, wenn sie nicht an ihnen interessiert sind.',
    'Alpakas werden vor allem wegen ihrem Fell und ihrer Wolle gezüchtet.',
    'Alpakas sind Vegetarier.',
    'Alpakas werden bis zu 25 Jahre alt.',
    'Alpakas werden nicht gerne gestreichelt.',
    'Alpakas sind keine Lasttiere.',

]

$(document).ready(function () {
    var $el = $("#operators");
    $el.empty(); // remove old options
    $.each(operator_list, function (key, value) {
        $el.append($("<option></option>")
            .attr("value", value).text(key));
    });

    function generate_random_number(min, max, cur_op, n) {
        if ((n == 2 && !over_tens && '+-'.includes(cur_op)) || ('*/'.includes(cur_op) && small_mult_table))
            return Math.floor(Math.random() * (10 - 0 + 1) + 0); // between 0 and 10
        else
            return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function get_random_operator(operators) {
        return operators[[Math.floor(Math.random() * operators.length)]];
    }

    function set_min_num() {
        if (min_num != parseInt($('#minnum').val(), 10)) {
            min_num = parseInt($('#minnum').val(), 10);
            validate_settings();
        }
    }

    function set_max_num() {
        if (max_num != parseInt($('#maxnum').val(), 10)) {
            max_num = parseInt($('#maxnum').val(), 10);
            validate_settings();
        }
    }

    function validate_settings() {
        valid_settings = false;
        msg = "";
        if (min_num < -10000 || max_num > 10000) {
            msg = "Bitte einen Zahlenraum von -10.000 bis + 10.000 eingeben.";
        }
        else if (min_num >= max_num) {
            msg = "Die kleinste Zahl muss kleiner als die größere Zahl sein.";
        } else {
            valid_settings = true;
        }
        mark_settings(valid_settings, msg);
        generate_calculation();
    }

    function mark_settings(valid, msg) {
        if (valid) {
            $("#minnum").removeClass("wrong");
            $("#maxnum").removeClass("wrong");
            $("#alert-wrong-settings").fadeOut();
        } else {
            $("#minnum").addClass("wrong");
            $("#maxnum").addClass("wrong");
            $("#alert-wrong-settings").text(msg);
            $("#alert-wrong-settings").fadeIn();
        }
    }

    function invalid_calculation(num1, num2, cur_op, old_num1, old_num2) {
        var invalid = false;
        if (cur_op == '+' && (num1 + num2 > max_num || num1 + num2 < min_num || (!over_tens && Math.floor((num1 + num2) / 10) != Math.floor(num1 / 10)))) // addition
            invalid = true;
        else if (cur_op == "-" && (num1 - num2 < min_num || num1 - num2 > max_num || (!over_tens && Math.floor((num1 - num2) / 10) != Math.floor(num1 / 10)))) // subtraction
            invalid = true;
        else if (cur_op == "*" && (num1 * num2 > max_num || num1 * num2 < min_num || (small_mult_table && (num1 > 10 || num2 > 10)))) // multiplication
            invalid = true;
        else if (cur_op == "/" && (num1 / num2 < min_num || num1 / num2 > max_num || num1 < num2 || num1 % num2 != 0 || (small_mult_table && (num1 / num2 > 10 || num2 > 10)))) // division
            invalid = true;
        else if (old_num1 == num1 && old_num2 == num2 && static_n2 == '-')
            invalid = true;

        return invalid;
    }

    function generate_calculation() {
        if (valid_settings) {
            if (operator.length > 1)
                cur_op = get_random_operator(operator);
            else
                cur_op = operator;

            old_num1 = num1;
            old_num2 = num2;
            c = 0;
            do {
                if (c >= 5000000) {
                    valid_settings = false;
                    mark_settings(valid_settings, "Für diese Einstellungen können keine Rechnungen generiert werden.");
                    break;
                }
                num1 = generate_random_number(min_num, max_num, cur_op, 1);
                if ('*/'.includes(cur_op) && static_n2 != '-')
                    num2 = static_n2;
                else
                    num2 = generate_random_number(min_num, max_num, cur_op, 2);
                c++;
            } while (invalid_calculation(num1, num2, cur_op, old_num1, old_num2))
            if (valid_settings)
                write_calc(num1, num2, cur_op);
            else
                write_calc('...', '...', '+')
        }
    }

    function write_calc(num1, num2, cur_op) {
        calc = num1 + " " + cur_op + " " + num2 + " = ";
        $('#calculation').text(calc);
    }

    function update_n_right() {
        $('#status_right').text("Richtig: " + n_right);
    }

    function update_n_wrong() {
        $('#status_wrong').text("Falsch: " + n_wrong);
    }

    function reset_clock() {
        seconds = 0; minutes = 0; hours = 0;
        $('#clock').text("00:00:00");
    }

    function timer() {
        t = setTimeout(add, 1000);
    }

    function stop_clock() {
        clearTimeout(t);
    }

    function start_clock() {
        timer();
    }

    function add() {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }
        $('#clock').text((hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds));
        timer();
    }

    function wrong_result() {
        $("#result").addClass("wrong");
        $("#result").removeClass("correct");
        $("#alert-correct").fadeOut();
        $("#alert-wrong").fadeIn();
        n_wrong++;
        update_n_wrong();
    }

    function correct_result() {
        $("#result").removeClass("wrong");
        $("#result").addClass("correct");
        $("#alert-wrong").fadeOut();
        n_right++;
        if (n_right % 10 == 0) {
            $("#alert-correct").text(motivational_quotes[[Math.floor(Math.random() * motivational_quotes.length)]]);
            $("#alert-correct").fadeIn();
        } else
            $("#alert-correct").fadeOut();
        update_n_right();
        generate_calculation();
    }

    $("#gen").click(function () {
        generate_calculation();
    });

    $("#toggle-settings").click(function () {
        $("#settings").fadeToggle();
    });

    $('#result').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $('#solve').click();
            return false;
        }
    });

    $('#minnum').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            set_min_num();
            return false;
        }
    });

    $('#maxnum').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            set_max_num();
            return false;
        }
    });

    $('#minnum').focusout(function (e) {
        set_min_num();
    });

    $('#maxnum').focusout(function (e) {
        set_max_num();
    });

    $('#small-mult-table').change(function () {
        small_mult_table = $('#small-mult-table').is(':checked');
        validate_settings();
    });

    $('#over-tens').change(function () {
        over_tens = $('#over-tens').is(':checked');
        validate_settings();
    });

    $("#solve").click(function () {
        var res = $('#result').val();
        var c = $('#calculation').text().replace(/\s/g, '').replace(/=/g, '').replace(/--/g, '+');
        if (res == eval(c)) {
            correct_result();
        } else {
            wrong_result();
        }
        $("#result").val('');
        $("#result").select();
    });

    $('#operators').change(function () {
        if ($(this).val().includes('*') || $(this).val().includes('/')) {
            $("#settings-mult").fadeIn();
        } else {
            $("#settings-mult").fadeOut();
        }
        operator = $(this).val();
        validate_settings();
    });
    $('#operators').change();

    $('#mult-series').change(function () {
        static_n2 = $(this).val();
        validate_settings();
    });

    $('#start').click(function (e) {
        start_clock();
    });

    $('#stop').click(function (e) {
        stop_clock();
    });

    $("#reset").click(function () {
        n_right = 0;
        n_wrong = 0;
        update_n_wrong();
        update_n_right();
        stop_clock();
        reset_clock();
    });

    $('#use-clock').change(function () {
        if ($('#use-clock').is(':checked')) {
            $("#stop-watch").fadeIn();
            $("#stop-watch-btn").fadeIn();
        } else {
            stop_clock();
            $("#stop-watch").fadeOut();
            $("#stop-watch-btn").fadeOut();
        }
    });

    $('#refresh').click(function (e) {
        generate_calculation();
    });

    function update_alpaca_fact() {
        $("#alpaca-fact").text(alpaca_facts[[Math.floor(Math.random() * alpaca_facts.length)]]);
    }

    update_alpaca_fact();
    generate_calculation();
});