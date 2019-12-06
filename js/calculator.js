var min_num, max_num;
var operator_list = {
    "+": "+"
    , "-": "-"
    , "*": "*"
    , "/": "/"
    , "+ -": "+-"
    , "* /": "*/"
    , "+ - * /": "+-*/"
};
var num1, num2;
var operator = "*";

var n_right = 0;

var motivational_quotes = [
    'Du kannst schon super rechnen, weiter so!',
    'Schon wieder richtig! Du wirst immer besser!',
    'Gut gemacht!',
    'Super!',
    'Sehr gut!',
    'Weiter so!'
]

$(document).ready(function () {
    var $el = $("#operators");
    $el.empty(); // remove old options
    $.each(operator_list, function (key, value) {
        $el.append($("<option></option>")
            .attr("value", value).text(key));
    });

    generate_calculation();

    function generate_random_number(min, max, operator, n) {
        if ((operator == '*') || (operator == '/' && n == 2)){
            min = 1;
            max = 10;
        }

        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function get_random_operator(operators) {
        return operators[[Math.floor(Math.random() * operators.length)]];
    }

    function generate_calculation() {
        min_num = parseInt($('#minnum').val(), 10);
        max_num = parseInt($('#maxnum').val(), 10);

        if (min_num >= max_num || min_num * 2 > max_num) {
            $("#minnum").addClass("wrong");
            $("#maxnum").addClass("wrong");
            $("#alert-wrong-settings").removeClass("not-shown");
        } else {
            $("#minnum").removeClass("wrong");
            $("#maxnum").removeClass("wrong");
            $("#alert-wrong-settings").addClass("not-shown");
            operators = $('#operators option:selected').text().replace(/\s/g, '');;
            if (operators.length > 1) {
                operator = get_random_operator(operators);
            } else {
                operator = operators;
            }
            old_num1 = num1;
            old_num2 = num2;
            do {
                num1 = generate_random_number(min_num, max_num, operator, 1);
                num2 = generate_random_number(min_num, max_num, operator, 2);
            } while (
                (operator == "+" && num1 + num2 > max_num)
                || (operator == "-" && num1 - num2 < min_num)
                || (operator == "*" && (num1 * num2 > max_num * max_num))
                || (operator == "/" && (num1 / num2 < min_num || num1 % num2 != 0 || num1 / num2 > 10))
                || (old_num1 == num1) || (old_num2 == num2)
            )
            set_values();
        }
    }

    function set_values() {
        calc = num1 + " " + operator + " " + num2 + " = ";
        $('#calculation').text(calc);
    }

    function update_n_right() {
        $('#status').text("Richtige Rechnungen: " + n_right);
    }

    function show_motivation_alert() {
        $("#alert-correct").removeClass("not-shown");
        $("#alert-correct").text(motivational_quotes[[Math.floor(Math.random() * motivational_quotes.length)]]);
    }

    $("#gen").click(function () {
        generate_calculation();
    });

    $("#reset").click(function () {
        n_right = 0;
        update_n_right();
    });

    $("#toggle-settings").click(function () {
        if ($("#settings").hasClass("not-shown"))
            $("#settings").removeClass("not-shown");
        else
            $("#settings").addClass("not-shown");
    });

    $('#result').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $('#solve').click();
            return false;
        }
    });

    $("#solve").click(function () {
        var res = $('#result').val();
        if (res == eval(num1 + operator + num2)) {
            $("#result").removeClass("wrong");
            $("#result").addClass("correct");
            $("#alert-wrong").addClass("not-shown");
            n_right++;
            if (n_right % 10 == 0) {
                show_motivation_alert();
            } else
                $("#alert-correct").addClass("not-shown");
            update_n_right();
            generate_calculation();
        } else {
            $("#result").addClass("wrong");
            $("#alert-correct").addClass("not-shown");
            $("#alert-wrong").removeClass("not-shown");
            $("#result").removeClass("correct");
        }
        $("#result").select();
    });
});